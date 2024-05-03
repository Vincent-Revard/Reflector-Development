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
    Course
)

class NotesById(BaseResource):
    model = Note
    schema = NoteSchema()

    @jwt_required_modified
    def get(self, course_id=None, topic_id=None, note_id=None):
        user_id = get_jwt_identity()
        ipdb.set_trace()
        note = Note.query.filter_by(id=note_id, user_id=user_id).first()
        if note is None:
            return {"message": "Note not found"}, 404
        return super().get(note_id)

    @jwt_required_modified
    def delete(self, course_id=None, topic_id=None, note_id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        note = Note.query.get(note_id)
        if note is None:
            return {"message": "Note not found"}, 404
        if note.topic.course_id != course_id:
            return {"message": "Note does not belong to the specified course"}, 400
        if note.topic_id != topic_id:
            return {"message": "Note does not belong to the specified topic"}, 400
        ipdb.set_trace()
        return super().delete(note_id)

    @jwt_required_modified
    def patch(self, course_id=None, topic_id=None, note_id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        note = Note.query.get(note_id)
        if note is None:
            return {"message": "Note not found"}, 404
        if note.topic.course_id != course_id:
            return {"message": "Note does not belong to the specified course"}, 400
        if note.topic_id != topic_id:
            return {"message": "Note does not belong to the specified topic"}, 400
        ipdb.set_trace()
        return super().patch(note_id)

    @jwt_required_modified
    def post(self, course_id=None, topic_id=None):
        return {"message": "Method not allowed"}, 405
