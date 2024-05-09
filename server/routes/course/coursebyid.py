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
    CourseSchema
)
from flask_jwt_extended import current_user


class CourseById(BaseResource):
    model = Course
    schema = CourseSchema

    @jwt_required_modified()
    def get(self, course_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if course_id:
            course = Course.query.filter_by(id=course_id).first()
            if course:
                return {"course": self.schema.dump(course)}, 200
            else:
                return {"message": f"Could not find Course with id #{course_id}"}, 404

        return {"message": "Course ID not provided"}, 400

    @jwt_required_modified()
    def patch(self, course_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if course_id:
            course = Course.query.filter_by(id=course_id).first()
            if course:
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
                return {"message": f"Could not find Course with id #{course_id}"}, 404

        return {"message": "Invalid request"}, 400
