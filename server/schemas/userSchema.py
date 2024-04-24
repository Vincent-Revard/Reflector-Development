from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.user import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  # Optional: deserialize to model instances

    username = fields.Str(
        required=True,
        validate=[Length(min=2), Length(max=50)],
        metadata={"description": "The unique username of the user"},
    )
    password_hash = fields.Str(
        load_only=True,
        required=True,
        metadata={"description": "The password of the user"},
    )
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

