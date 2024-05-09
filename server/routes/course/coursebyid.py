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
    get_related_data,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    get_jwt_identity,
    Course,
    db,
    CourseSchema,
    jwt_required
)
from flask_jwt_extended import current_user


class CourseById(BaseResource):
    model = Course
    schema = CourseSchema()

    @jwt_required()
    def get(self, course_id=None, id=None):
        ipdb.set_trace()
        user = current_user
        if not user:
            return {"message": "404: User not found"}, 404

        id = course_id or id
        if id:
            course = next((c for c in user.enrolled_courses if c.id == id), None)
            if course:
                return {"course": self.schema.dump(course)}, 200
            else:
                return {
                    "message": f"404: Could not find Course with id #{id} enrolled by user #{user.username}"
                }, 404

        return {"message": "Course ID not provided"}, 400

    @jwt_required()
    def patch(self, course_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if course_id:
            course = Course.query.get(course_id)
            if course and course in user.enrolled_courses:
                data = request.get_json()
                course_data = data.get("course")
                if not course_data:
                    return {"message": "No course data provided"}, 400

                errors = self.schema.validate(course_data, partial=True)
                if errors:
                    return errors, 422

                course_data = self.schema.load(course_data, partial=True)
                for key, value in course_data.items():
                    if hasattr(course, key):
                        setattr(course, key, value)
                db.session.commit()

                return {"message": "Course updated successfully"}, 200
            else:
                return {
                    "message": f"Could not find Course with id #{course_id} enrolled by user #{user.id}"
                }, 404

        return {"message": "Invalid request"}, 400
