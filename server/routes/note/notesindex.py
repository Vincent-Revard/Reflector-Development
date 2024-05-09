from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
import ipdb

from .. import (
    request,
    NoteSchema,
    Note,
    BaseResource,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    Course,
    db,
    get_instance_by_id,
    ValidationError,
    jwt_required
)
from flask_jwt_extended import current_user


class NotesIndex(BaseResource):
    model = Note
    schema = NoteSchema()

    @jwt_required()
    def get(self, course_id=None, topic_id=None, note_id=None):
        if id is None:
            user_id = current_user.id
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
        # ipdb.set_trace()
        return super().get()

    @jwt_required()
    def delete(self, course_id=None, topic_id=None, id=None):
        user_id = current_user.id
        ipdb.set_trace()
        note = get_instance_by_id(Note, id)
        if note is None or note.user_id != user_id:
            return {"message": "Unauthorized"}, 401
        return super().delete(id)

    @jwt_required()
    def patch(self, course_id=None, topic_id=None, id=None):

        note = get_instance_by_id(Note, id)
        if note is None or note.user_id != current_user.id:
            return {"message": "Unauthorized"}, 401
        return super().patch(id)

    @jwt_required()
    def post(self, course_id=None, topic_id=None):
        note_data = request.get_json()
        if not note_data:
            return {"message": "Invalid data"}, 400

        try:
            note = self.schema.load(note_data)
        except ValidationError as err:
            return {"message": "Invalid data", "errors": err.messages}, 400

        user_id = current_user.id
        ipdb.set_trace

        note = Note(user_id=user_id, topic_id=topic_id, **note_data)
        try:
            ipdb.set_trace
            db.session.add(note)
            db.session.commit()
            ipdb.set_trace
        except IntegrityError:
            db.session.rollback()
            return {"message": "Failed to create note"}, 500

        return {"message": "Note created successfully", "note": self.schema.dump(note)}, 200
