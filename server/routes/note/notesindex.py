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
        return super().get(id)

    @jwt_required_modified
    def delete(self, course_id=None, topic_id=None, id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        note = Note.query.get(id)
        if note is None:
            return {"message": "Note not found"}, 404
        if note.topic.course_id != course_id:
            return {"message": "Note does not belong to the specified course"}, 400
        if note.topic_id != topic_id:
            return {"message": "Note does not belong to the specified topic"}, 400
        ipdb.set_trace()
        return super().delete(id)

    @jwt_required_modified
    def patch(self, course_id=None, topic_id=None, id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        note = Note.query.get(id)
        if note is None:
            return {"message": "Note not found"}, 404
        if note.topic.course_id != course_id:
            return {"message": "Note does not belong to the specified course"}, 400
        if note.topic_id != topic_id:
            return {"message": "Note does not belong to the specified topic"}, 400
        ipdb.set_trace()
        return super().patch(id)

    @jwt_required_modified
    def post(self, course_id=None, topic_id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        note_data = request.get_json()
        if not note_data:
            return {"message": "Invalid data"}, 400
        note = Note(
            title=note_data.get("title"),
            content=note_data.get("content"),
            topic_id=topic_id,
        )
        try:
            note.save()
        except IntegrityError:
            return {"message": "Failed to create note"}, 500
        return {"message": "Note created successfully"}, 201
