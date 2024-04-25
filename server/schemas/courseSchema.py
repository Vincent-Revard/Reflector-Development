from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.course import Course
from .usercourseSchema import UserCourseSchema

class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True

    user_courses = fields.Nested(UserCourseSchema, many=True)
