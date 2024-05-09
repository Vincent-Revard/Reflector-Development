from .. import (
    request,
    CourseSchema,
    Course,
    g,
    BaseResource,
    jwt_required_modified,
    get_related_data,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    get_jwt_identity,
    
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from flask_jwt_extended import current_user

import ipdb

class CoursesIndex(BaseResource):
    model = Course
    schema = CourseSchema()

    @jwt_required_modified()
    def get(self, id=None, condition=None):
        if id is None:
            user_id = current_user.id

            # user_id = get_jwt_identity()
            user = User.query.options(
                joinedload(User.enrolled_courses)
                .joinedload(Course.course_topics)
                .joinedload(CourseTopic.topic)
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
                            "notes": [
                                {
                                    "id": note.id,
                                    "name": note.name,
                                    "category": note.category,
                                    "content": note.content,
                                }
                                for note in topic.notes
                            ],
                        }
                        for topic in course.topics
                    ],
                }
                for course in user.enrolled_courses
            ]
            return {"courses": courses}, 200
        # ipdb.set_trace()
        return super().get(id, condition)

    @jwt_required_modified()
    def delete(self, id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        # ipdb.set_trace()
        return super().delete(id)

    @jwt_required_modified()
    def patch(self, id):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        # ipdb.set_trace()

        return super().patch(g.courses.id)

    @jwt_required_modified()
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
