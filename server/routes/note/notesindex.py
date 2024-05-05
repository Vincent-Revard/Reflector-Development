from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
import ipdb

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
    redis_client,
    get_jwt,
    json,
    get_instance_by_id,
)

class NotesIndex(BaseResource):
    model = Note
    schema = NoteSchema()

    @jwt_required_modified
    def get(self, course_id=None, topic_id=None, note_id=None):
        if id is None:
            user_id = get_jwt_identity()
            user = User.query.options(
                joinedload(User.enrolled_courses)
                .joinedload(Course.course_topics)
                .joinedload(CourseTopic.topic)
                .joinedload(Topic.notes)
            ).get(user_id)
            notes = []
            for course in user.enrolled_courses:
                for topic in course.topics:
                    notes.extend(topic.notes)
            return {"notes": self.schema.dump(notes, many=True)}, 200
        ipdb.set_trace()
        return super().get()

    @jwt_required_modified
    def delete(self, course_id=None, topic_id=None, id=None):
        # Get the jti from the JWT token
        jti = get_jwt()["jti"]

        # Check if the user is authorized to delete the note
        user_session_str = redis_client.get(jti)
        if user_session_str is None:
            return {"message": "Unauthorized"}, 401

        user_session = json.loads(user_session_str)
        user_id = user_session["user_id"]

        user = get_instance_by_id(User, user_id)
        note = get_instance_by_id(Note, id)
        if note is None or note.user_id != user_id:
            return {"message": "Unauthorized"}, 401
        return super().delete(id)

    @jwt_required_modified
    def patch(self, course_id=None, topic_id=None, id=None):
        # Get the jti from the JWT token
        jti = get_jwt()["jti"]

        # Check if the user is authorized to update the note
        user_session_str = redis_client.get(jti)
        if user_session_str is None:
            return {"message": "Unauthorized"}, 401

        user_session = json.loads(user_session_str)
        user_id = user_session["user_id"]

        user = get_instance_by_id(User, user_id)
        note = get_instance_by_id(Note, id)
        if note is None or note.user_id != user_id:
            return {"message": "Unauthorized"}, 401
        return super().patch(id)

    @jwt_required_modified
    def post(self, course_id=None, topic_id=None):
        note_data = request.get_json()
        if not note_data:
            return {"message": "Invalid data"}, 400

        # Get the jti from the JWT token
        jti = get_jwt()["jti"]

        # Check if the user is authorized to create a note for the given topic
        user_session_str = redis_client.get(jti)
        if user_session_str is None:
            return {"message": "Unauthorized"}, 401

        user_session = json.loads(user_session_str)
        user_id = user_session["user_id"]

        # Create the note
        note = Note(
            name=note_data.get("name"),
            title=note_data.get("title"),
            content=note_data.get("content"),
            user_id=user_id,
            topic_id=topic_id,
            category=note_data.get("category"),
        )
        try:
            db.session.add(note)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"message": "Failed to create note"}, 500

        return {"message": "Note created successfully"}, 200
