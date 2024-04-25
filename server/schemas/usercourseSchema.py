from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError, post_load, Schema
from marshmallow.validate import Length
from config import ma
from models.usercourse import UserCourse


class UserCourseSchema(Schema):
    class Meta:
        model = UserCourse
        load_instance = True

    user = fields.Nested("UserSchema")

    @post_load
    def make_usercourse(self, data, **kwargs):
        return UserCourse(**data)
