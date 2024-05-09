from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
import ipdb
from sqlalchemy import and_


from .. import (
    request,
    NoteSchema,
    Note,
    g,
    BaseResource,
    jwt_required_modified,
    get_related_data,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    get_jwt_identity,
    Course,
    db,
    TopicSchema
)
from flask_jwt_extended import current_user


class TopicsById(BaseResource):
    model = Topic
    schema = TopicSchema

    @jwt_required_modified()
    def get(self, topic_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if topic_id:
            topic = Topic.query.filter_by(id=topic_id).first()
            if topic:
                return {"topic": self.schema.dump(topic)}, 200
            else:
                return {"message": f"Could not find Topic with id #{topic_id}"}, 404

        return {"message": "Topic ID not provided"}, 400

    @jwt_required_modified()
    def patch(self, topic_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if topic_id:
            topic = Topic.query.filter_by(id=topic_id).first()
            if topic:
                data = request.get_json()
                topic_data = data.get("topic")
                if not topic_data:
                    return {"message": "No topic data provided"}, 400

                errors = self.schema.validate(topic_data, partial=True)
                if errors:
                    return errors, 422

                topic_data = self.schema.load(topic_data, partial=True)
                for key, value in topic_data.items():
                    if hasattr(topic, key):
                        setattr(topic, key, value)
                db.session.commit()

                return {"message": "Topic updated successfully"}, 200
            else:
                return {"message": f"Could not find Topic with id #{topic_id}"}, 404

        return {"message": "Invalid request"}, 400
