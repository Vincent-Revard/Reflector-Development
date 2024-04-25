from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.usercourse import UserCourse
from .userSchema import UserSchema



class UserCourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserCourse
        load_instance = True

    user = fields.Nested(UserSchema)
