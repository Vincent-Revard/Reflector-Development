from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

import ipdb

from .. import (
    request,
    BaseResource,
    jwt_required,
    Topic,
    TopicSchema,
    db,
    ValidationError,
    current_user,
    User,
    Course,
    UserTopic,
)
import ipdb

class TopicsIndex(BaseResource):
    model = Topic
    schema = TopicSchema()

    @jwt_required()
    def get(self, course_id):
        user_id = current_user.id
        user = User.query.options(
            joinedload(User.enrolled_courses).joinedload(Course.topics)
        ).get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        topics = [
            {
                "id": topic.id,
                "name": topic.name,
                "creator_id": topic.creator_id,
                "course_name": course.name,
            }
            for course in user.enrolled_courses
            if course.id == course_id
            for topic in course.topics
            if UserTopic.query.filter_by(
                user_id=user_id,
                course_id=course.id,
                topic_id=topic.id,
            ).first()
        ]
        return {"topics": topics}, 200

    @jwt_required()
    def delete(self, course_id, id=None):
        # Similar logic as CoursesIndex.delete
        pass

    @jwt_required()
    def patch(self, course_id, id):
        # Similar logic as CoursesIndex.patch
        pass

    @jwt_required()
    def post(self, course_id=None):
        topic_data = request.get_json()
        if not topic_data:
            return {"message": "Invalid data"}, 400

        try:
            topic = self.schema.load(topic_data)
        except ValidationError as err:
            return {"message": "Invalid data", "errors": err.messages}, 400

        user_id = current_user.id

        # Create a new topic with the user's id as the creator id
        topic = Topic(creator_id=user_id, **topic_data)
        db.session.add(topic)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"message": "Failed to create"}, 500

        return {
            "message": "Created successfully",
            "topic": self.schema.dump(topic),
        }, 200
