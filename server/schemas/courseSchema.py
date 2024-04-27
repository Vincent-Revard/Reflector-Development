from marshmallow import fields
from .usercourseSchema import UserCourseSchema

from config import ma
from . import (
    Course,

)


class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True

    user_courses = fields.Nested(UserCourseSchema, many=True)
