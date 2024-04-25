from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.user import User
import ipdb


class UserSchema(ma.SQLAlchemyAutoSchema):
    ipdb.set_trace()
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

    def load(self, data, instance=None, *, partial=False, **kwargs):
        ipdb.set_trace()

        # Load the instance using Marshmallow's default behavior
        loaded_instance = super().load(
            data, instance=instance, partial=partial, **kwargs
        )
        ipdb.set_trace()
        if "password" in data:
            password = data.pop("password")
            is_signup = self.context.get("is_signup")
            if is_signup:
                # During signup, use the password setter in the User model to hash the password
                loaded_instance.password = password
            else:
                # During login, store the password as is for authentication
                loaded_instance._password_hash = password

        # Set attributes manually, triggering property setters
        for key, value in data.items():
            setattr(loaded_instance, key, value)
        print(loaded_instance)
        print(data)
        setattr(loaded_instance, key, value)
        ipdb.set_trace()

        return loaded_instance

#! Create schema for a single crew_member
user_schema = UserSchema()
#! Create schema for a collection of crew_members
# * Feel free to use only and exclude to customize
users_schema = UserSchema(many=True)
