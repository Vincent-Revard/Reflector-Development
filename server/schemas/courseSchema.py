from marshmallow import fields, post_load


from config import ma
from . import Course
from .userSchema import UserSchema
from .usercourseSchema import UserCourseSchema
from .topicSchema import TopicSchema

class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True
        exclude = ("creator",)

    id = ma.auto_field()
    creator_id = ma.auto_field()
    user_courses = fields.Nested("UserCourseSchema", many=True)
    topics = fields.Nested("TopicSchema", many=True)

    @post_load
    def make_course(self, data, **kwargs):
        return data
