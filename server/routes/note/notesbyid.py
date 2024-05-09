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
from flask_jwt_extended import current_user

class NotesById(BaseResource):
    model = Note
    schema = NoteSchema()

    @jwt_required_modified()
    def get(self, course_id=None, topic_id=None, note_id=None):
        user = current_user
        ipdb.set_trace()
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
                    # ipdb.set_trace()
                    return {"note": self.schema.dump(note)}, 200
                else:
                    return {
                        "message": "User is not enrolled in the course associated with this note"
                    }, 400
            else:
                return {"message": "Note not found"}, 404

        return {"message": "Topic ID or note ID not provided"}, 400

    @jwt_required_modified()
    def delete(self, course_id=None, topic_id=None, note_id=None):
        user = current_user

        if not user:
            return {"message": "User not found"}, 404

        if course_id and topic_id and note_id:
            # Check if the user is enrolled in the course
            if any(course.id == course_id for course in user.enrolled_courses):
                # Fetch the note
                note = Note.query.filter_by(topic_id=topic_id, id=note_id, user_id=current_user.id).first()
                if note:
                    # Delete the note
                    db.session.delete(note)
                    db.session.commit()

                    return {"message": "Note deleted successfully"}, 200
                else:
                    return {"message": "Note not found"}, 404
            else:
                return {"message": "User is not enrolled in the course"}, 400

        return {"message": "Invalid request"}, 400

    @jwt_required_modified()
    def patch(self, course_id=None, topic_id=None, note_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404
        ipdb.set_trace()
        if course_id and topic_id and note_id:
            # Check if the user is enrolled in the course
            if any(course.id == course_id for course in user.enrolled_courses):
                # Fetch the note
                note = Note.query.filter_by(
                    topic_id=topic_id, id=note_id, user_id=current_user.id
                ).first()
                if note:
                    # Get the data from the request
                    data = request.get_json()
                    ipdb.set_trace()
                    # Extract the 'note' data
                    note_data = data.get("note")
                    if not note_data:
                        return {"message": "No note data provided"}, 400
                    # Validate the data
                    errors = self.schema.validate(note_data, partial=True)
                    if errors:
                        return errors, 422
                    # Load the data
                    note_data = self.schema.load(note_data, partial=True)

                    # Fetch the note
                    note = Note.query.filter_by(topic_id=topic_id, id=note_id).first()
                    if note:
                        # Convert note_data to a dictionary
                        note_data_dict = note_data.__dict__
                        # Update the note
                        for key, value in note_data_dict.items():
                            if hasattr(note, key):
                                setattr(note, key, value)
                        db.session.commit()

                        return {"message": "Note updated successfully"}, 200
                    else:
                        return {"message": "Note not found"}, 404
            else:
                return {"message": "User is not enrolled in the course"}, 400

        return {"message": "Invalid request"}, 400
