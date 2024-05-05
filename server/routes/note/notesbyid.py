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
    db
)

class NotesById(BaseResource):
    model = Note
    schema = NoteSchema()

    @jwt_required_modified

    def get(self, course_id=None, topic_id=None, note_id=None):
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if not user:
            return {"message": "User not found"}, 404

        if topic_id and note_id:
            # Fetch the note along with its topic, the topic's courses, and the note's references
            note = (
                db.session.query(Note)
                .options(
                    joinedload(Note.topic).joinedload(Topic.courses),
                    joinedload(
                        Note.references
                    ),  # Add this line to include the references
                )
                .filter_by(id=note_id)
                .first()
            )
            ipdb.set_trace()

            if note and note.topic_id == topic_id:
                # Check if the user is enrolled in any of the courses associated with the note's topic
                if any(
                    course.id in (course.id for course in user.enrolled_courses)
                    for course in note.topic.courses
                ):
                    ipdb.set_trace()
                    return {"note": self.schema.dump(note)}, 200
                else:
                    return {
                        "message": "User is not enrolled in the course associated with this note"
                    }, 400
            else:
                return {"message": "Note not found"}, 404

        return {"message": "Topic ID or note ID not provided"}, 400

    @jwt_required_modified
    def delete(self, course_id=None, topic_id=None, note_id=None):
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if not user:
            return {"message": "User not found"}, 404

        if course_id and topic_id and note_id:
            # Check if the user is enrolled in the course
            if any(course.id == course_id for course in user.enrolled_courses):
                # Fetch the note
                note = Note.query.filter_by(topic_id=topic_id, id=note_id).first()
                if note:
                    return super().delete(note_id)
                else:
                    return {"message": "Note not found"}, 404
            else:
                return {"message": "User is not enrolled in the course"}, 400

        return {"message": "Invalid request"}, 400

    @jwt_required_modified
    def patch(self, course_id=None, topic_id=None, note_id=None):
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if not user:
            return {"message": "User not found"}, 404

        if course_id and topic_id and note_id:
            # Check if the user is enrolled in the course
            if any(course.id == course_id for course in user.enrolled_courses):
                # Fetch the note
                note = Note.query.filter_by(topic_id=topic_id, id=note_id).first()
                if note:
                    return super().patch(note_id)
                else:
                    return {"message": "Note not found"}, 404
            else:
                return {"message": "User is not enrolled in the course"}, 400

        return {"message": "Invalid request"}, 400

    @jwt_required_modified
    def post(self, course_id=None, topic_id=None):
        return {"message": "Method not allowed"}, 405
