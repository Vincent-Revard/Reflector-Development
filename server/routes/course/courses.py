from .. import (
    request,
    CourseSchema,
    Course,
    g,
    BaseResource,
    get_related_data,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    get_jwt_identity,
    jwt_required,
    ValidationError,
    db,
    UserTopic

)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from flask_jwt_extended import current_user

import ipdb


class CoursesIndex(BaseResource):
    model = Course
    schema = CourseSchema()

    @jwt_required()
    def get(self):
        user_id = current_user.id
        user = User.query.options(
            joinedload(User.enrolled_courses)
            .joinedload(Course.topics)
            .joinedload(Topic.notes)
        ).get(user_id)
        courses = [
            {
                "id": course.id,
                "name": course.name,
                "creator_id": course.creator_id,
                "topics": [
                    {
                        "id": topic.id,
                        "name": topic.name,
                        "creator_id": topic.creator_id,
                        "notes": (
                            [
                                {
                                    "id": note.id,
                                    "name": note.name,
                                    "category": note.category,
                                    "content": note.content,
                                }
                                for note in topic.notes
                                if note.user_id == user_id
                            ]
                            if topic.notes
                            else []
                        ),
                    }
                    for topic in course.topics
                    if UserTopic.query.filter_by(
                        user_id=user_id,
                        course_id=course.id,
                        topic_id=topic.id,
                    ).first()
                ],
            }
            for course in user.enrolled_courses
        ]
        return {"courses": courses}, 200

    @jwt_required()
    def delete(self, id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401

        return super().delete(id)

    @jwt_required()
    def patch(self, id):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401

        return super().patch(g.courses.id)

    @jwt_required()
    def post(self, course_id=None):
        course_data = request.get_json()
        if not course_data:
            return {"message": "Invalid data"}, 400

        try:
            course = self.schema.load(course_data)
        except ValidationError as err:
            return {"message": "Invalid data", "errors": err.messages}, 400

        user_id = current_user.id

        if course_id:
            # If course_id is provided, create a new topic associated with the course
            topic = Topic(course_id=course_id, **course_data)
            db.session.add(topic)
        else:
            # If course_id is not provided, create a new course
            course = Course(creator_id=user_id, **course_data)
            db.session.add(course)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"message": "Failed to create"}, 500

        return {
            "message": "Created successfully",
            "course": self.schema.dump(course),
        }, 200
