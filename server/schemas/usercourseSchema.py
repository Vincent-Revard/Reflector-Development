from . import UserCourse
from config import ma
from marshmallow import fields, post_load


class UserCourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserCourse
        load_instance = True

    user = fields.Nested("UserSchema")

    @post_load
    def make_usercourse(self, data, **kwargs):
        return UserCourse(**data)
