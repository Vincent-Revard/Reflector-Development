from functools import wraps
from flask import request, g, render_template, make_response, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from .helpers.generate_csrf_token import generate_csrf_token
from .helpers.jwt_required_modified import jwt_required_modified
from .helpers.jwt_required_logout import jwt_required_logout
import json
from flask_marshmallow import Marshmallow
from flask_mail import Mail, Message

# from schemas.userupdateSchema import UserUpdateSchema
# from schemas.topicSchema import TopicSchema
# from schemas.userSchema import UserSchema
# from schemas.courseSchema import CourseSchema
# from schemas.noteSchema import NoteSchema
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import (
    ValidationError,
    fields,
    validates,
    ValidationError,
    pre_load,
    post_load,
    post_dump,
)
from sqlalchemy import select, not_
from marshmallow.validate import Length
from email_validator import validate_email, EmailNotValidError
from routes.utils.baseresource import BaseResource

# from models.production import Production
from models.user import User


from models.course import Course
from models.topic import Topic
from models.reference import Reference
from models.note import Note
from models.usercourse import UserCourse
from models.coursetopic import CourseTopic
from models.user import User
from models.notereference import NoteReference
from models.usertopic import UserTopic
from flask_jwt_extended import JWTManager

from routes.helpers.query_helpers import (
    get_all,
    get_all_by_condition,
    get_instance_by_id,
    get_one_by_condition,
    get_related_data,
)

# from schemas.userSchema import user_schema, users_schema
import ipdb
from models.user import User
from config import db, app, jwt, redis_client, mail, ma
import redis
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    current_user,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    unset_refresh_cookies,
    unset_access_cookies,
    get_jwt,
    verify_jwt_in_request,
    decode_token,
)
from flask_jwt_extended.exceptions import NoAuthorizationError


#! ==================
#! GENERAL ROUTE CONCERNS
@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404


# Callback function to check if a JWT exists in the redis blocklist
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = redis_client.get("blacklist:" + jti)
    return token_in_redis is not None


@app.before_request
def before_request():

    path_dict = {
        "coursesbyid": Course,
        "courses": Course,
        "referencebyid": Reference,
        "profilebyid": User,
        "profiles": User,
        "profilesbyid": User,
        "references": Reference,
        "notes": Note,
        "notesbyid": Note,
        "topics": Topic,
        "login": User,
        "signup": User,
        # "quizzes": Quiz,
        # "quizzesbyid": Quiz,
        "refresh": User,
    }

    try:
        id = request.view_args.get("id")
        print(id)
        if id is not None:
            record = get_instance_by_id(path_dict.get(request.endpoint), id)
            print(record)
            key_name = request.endpoint.split("byid")[0]
            setattr(g, key_name, record)
        else:
            key_name = request.endpoint
            setattr(g, key_name, None)
    except Exception as e:
        print(e)


# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
# @jwt.user_lookup_loader
# def user_lookup_callback(_jwt_header, jwt_data):
#     identity = jwt_data["sub"]
#
#     return get_instance_by_id(User, identity)
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]

    return get_instance_by_id(User, identity)


class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True
        exclude = ("creator",)

    id = ma.auto_field()
    creator_id = ma.auto_field()
    user_courses = fields.Nested("UserCourseSchema", many=True)

    @post_load
    def make_course(self, data, **kwargs):
        return data

class CourseTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CourseTopic
        load_instance = True

    course = fields.String(attribute="course.name")


class NoteReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NoteReference
        load_instance = True
        fields = ("reference",)

    note_id = fields.Int()
    note_instance = fields.Nested("NoteSchema")
    reference = fields.Nested("ReferenceSchema")


class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Note
        load_instance = True
        exclude = ("topic.notes",)

    category = ma.auto_field()
    content = ma.auto_field()
    title = ma.auto_field()
    topic = fields.Nested("TopicSchema")
    references = fields.Nested("NoteReferenceSchema", many=True)

    @post_dump
    def remove_empty_references(self, data, **kwargs):
        if "references" in data and not data["references"]:
            data.pop("references")
        return data

    @post_load
    def make_note(self, data, **kwargs):
        return data


class ReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reference
        load_instance = True
        exclude = ("user",)

    id = fields.Int()
    name = fields.Str()
    title = fields.Str()
    user_id = fields.Int()
    author_last = fields.Str()
    author_first = fields.Str()
    organization_name = fields.Str()
    container_name = fields.Str()
    publication_day = fields.Int()
    publication_month = fields.Str()
    publication_year = fields.Int()
    url = fields.Str()
    access_day = fields.Int()
    access_month = fields.Str()
    access_year = fields.Int()


class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        exclude = ("creator",)

    id = ma.auto_field()
    creator_id = ma.auto_field()
    name = ma.auto_field()
    notes = fields.Nested("NoteSchema", many=True)
    course_topics = fields.Method("get_course_topics")

    def get_course_topics(self, obj):
        course_id = self.context.get('course_id')
        return CourseTopicSchema(many=True).dump([ct for ct in obj.course_topics if ct.course_id == course_id])

    @post_load
    def make_topic(self, data, **kwargs):
        return data


class UserCourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserCourse
        load_instance = True

    user = fields.Nested(
        "UserSchema",
    )
    course = fields.Nested(
        "CourseSchema",
        many=True,
    )

    @post_load
    def make_usercourse(self, data, **kwargs):
        return data


class CourseMinimalSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True
        exclude = ("creator",)


class TopicMinimalSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        exclude = ("creator",)


class UserTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserTopic
        load_instance = True
        include_fk = True

    user_id = fields.Int()
    topic_id = fields.Int()
    course_id = fields.Int()
    topic = fields.Nested(TopicMinimalSchema)
    course = fields.Nested(CourseMinimalSchema)


class UserSchema(ma.SQLAlchemyAutoSchema):

    class Meta:
        model = User
        load_instance = True  # Optional: deserialize to model instances
        exclude = ("_password_hash", "created_courses", "created_topics")

    id = fields.Int(dump_only=True)

    username = fields.Str(
        required=True,
        validate=[Length(min=2), Length(max=50)],
        metadata={"description": "The unique username of the user"},
    )
    password = fields.Str(load_only=True, required=True, validate=Length(min=8))
    email = fields.Str(
        metadata={"description": "The email of the user"},
    )
    email_verified = fields.Boolean(  # New field for email verification status
        metadata={"description": "The email verification status of the user"},
    )
    created_courses = fields.Nested(
        "CourseMinimalSchema",
        many=True,
        # exclude=("creator_id.creator.id", "creator.created.created_courses"),
    )
    created_topics = fields.Nested(
        "TopicMinimalSchema",
        many=True,
        # exclude=("creator_id.creator.id", "creator.created_topics"),
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

        # Load the instance using Marshmallow's default behavior
        loaded_instance = super().load(
            data, instance=instance, partial=partial, **kwargs
        )
        if "password" in data:
            password = data.pop("password")
            is_signup = self.context.get("is_signup")
            if is_signup:
                # During signup, use the password setter in the User model to hash the password
                loaded_instance.password = password
            else:
                # During login, store the password as is for authentication
                loaded_instance._password_hash = password
            # Put the password back into the data
            data["password"] = password

        # Set attributes manually, triggering property setters
        for key, value in data.items():
            setattr(loaded_instance, key, value)
        print(loaded_instance)
        print(data)
        setattr(loaded_instance, key, value)

        return loaded_instance


#!     do I want a user dictionary instead of object? reference!
# def load(self, data, instance=None, *, partial=False, **kwargs):
#     # Load the instance using Marshmallow's default behavior
#     loaded_instance = super().load(
#         data, instance=instance, partial=partial, **kwargs
#     )

#     if "password" in data:
#         password = data.pop("password")
#         is_signup = self.context.get("is_signup")
#         if is_signup:
#             # During signup, use the password setter in the User model to hash the password
#             loaded_instance.password = password
#         else:
#             # During login, store the password as is for authentication
#             loaded_instance._password_hash = password
#         # Put the password back into the data
#         data["password"] = password

#     # Convert the loaded_instance back to a dictionary
#     data = {c.name: getattr(loaded_instance, c.name) for c in loaded_instance.__table__.columns}

#     return data


# notes = fields.Nested("NoteSchema", many=True, exclude=('user_id',))
user_courses = fields.Nested("UserCourseSchema", many=True, exclude=("user_id",))
# references = fields.Nested('ReferenceSchema', many=True, exclude=('user_id',))

#! Create schema for a single crew_member
user_schema = UserSchema()
#! Create schema for a collection of crew_members
# * Feel free to use only and exclude to customize
users_schema = UserSchema(many=True)


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
        load_only=True, metadata={"description": "The current password of the user"}
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
