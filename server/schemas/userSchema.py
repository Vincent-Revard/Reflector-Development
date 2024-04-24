from email_validator import validate_email, EmailNotValidError
from marshmallow import Schema, fields, validates, ValidationError, pre_load, post_dump
from marshmallow.validate import Length, Regexp
# from . import db
from models.user import User
from sqlalchemy import select


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
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

    # @validates("username")
    # def validate_username(self, value):
    #     if self.context.get("is_signup"):
    #         if get_one_by_condition(User, User.username == value):
    #             raise ValidationError("Username already exists")
    #     else:  # This is the login case
    #         if not get_one_by_condition(User, User.username == value):
    #             raise ValidationError("Username does not exist")

    # @validates("email")
    # def validate_email(self, value):
    #     if self.context.get("is_signup") and get_one_by_condition(
    #         User, User.email == value
    #     ):
    #         raise ValidationError("Email already exists")


#!helpers
# def get_one_by_condition(model, condition):
#     # stmt = select(model).where(condition)
#     # result = db.session.execute(stmt)
#     # return result.scalars().first()
#     return execute_query(select(model).where(condition)).first()


# def execute_query(query):
#     return db.session.execute(query).scalars()
