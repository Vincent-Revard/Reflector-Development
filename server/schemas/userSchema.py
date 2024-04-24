from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.user import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  # Optional: deserialize to model instances
        exclude = ("_password_hash",)

    username = fields.Str(
        required=True,
        validate=[Length(min=2), Length(max=50)],
        metadata={"description": "The unique username of the user"},
    )
    # password_hash = ma.auto_field("_password_hash", load_only=True, required=True)
    password = fields.Str(
        load_only=True, required=True, validate=Length(min=8)
    )
    # _password_hash = fields.Str(dump_only=True)
    email = fields.Str(
        metadata={"description": "The email of the user"},
    )
    game_master = fields.Boolean(
        metadata={
            "description": "The option to determine if this user is a game master or not"
        }
    )

    @validates("email")
    def validate_email(self, value):
        try:
            v = validate_email(value)
        except EmailNotValidError as e:
            raise ValidationError(str(e))

    @validates("password")
    def validate_password(self, value):
        is_signup = self.context.get("is_signup")
        if is_signup and len(value) < 8:
            raise ValidationError("Password must be at least 8 characters long")
