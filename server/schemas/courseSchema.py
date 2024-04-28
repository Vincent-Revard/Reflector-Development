from marshmallow import fields
from .usercourseSchema import UserCourseSchema
from .topicSchema import TopicSchema

from config import ma
from . import (
    Course,

)

class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True

    user_courses = fields.Nested(UserCourseSchema, many=True)
    course_topics = fields.Nested(TopicSchema, many=True)
