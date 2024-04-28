from marshmallow import fields, pre_load, validates
from marshmallow.validate import Length

from config import ma
from . import User

class UserUpdateSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True  # Optional: deserialize to model instances
        exclude = ("_password_hash",)

    id = fields.Int(dump_only=True)
    username = fields.Str(
        required=True,
        validate=Length(min=2),
        metadata={"description": "The unique username of the user"},
    )
    email = fields.Str(
        metadata={"description": "The email of the user"}
    )  #! NEED REGEX!
    password = fields.Str(
        validate=Length(min=1),
        load_only=True,
        metadata={"description": "The new password of the user"},
    )
    current_password = fields.Str(
        load_only=True,
        metadata={"description": "The current password of the user"}
    )

    @pre_load
    def strip_strings(self, data, is_signup=None, **kwargs):
        extra_data = kwargs.get("extra_data")
        print(f"Extra data: {extra_data}")
        #! example use of kwags:
        #! user_schema.load(data, extra_data="extra")
        #! can do something with this like logging or tracking things
        for key, value in data.items():
            if isinstance(value, str):
                data[key] = value.strip()
        return data
