from functools import wraps
from flask import request, g, render_template, make_response, jsonify
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from .helpers.generate_csrf_token import generate_csrf_token
from .helpers.jwt_required_modified import jwt_required_modified
import json
from flask_mail import Mail, Message
from schemas.userupdateSchema import UserUpdateSchema
from schemas.courseSchema import CourseSchema
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import ValidationError, fields, validates, ValidationError, pre_load
from sqlalchemy import select
from routes.utils.baseresource import BaseResource
# from models.production import Production
from models.user import User
from models.course import Course
from models.topic import Topic
from models.reference import Reference
from models.note import Note
from models.usercourse import UserCourse
from models.coursetopic import CourseTopic

from routes.helpers.query_helpers import (
    get_all,
    get_all_by_condition,
    get_instance_by_id,
    get_one_by_condition,
    get_related_data,
)

from schemas.userSchema import user_schema, users_schema
import ipdb
from models.user import User
from config import db, app, jwt, redis_client, mail
import redis
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    unset_refresh_cookies,
    unset_access_cookies,
    current_user,
    get_jwt,
    verify_jwt_in_request,
    decode_token,
    jwt_required,
)
from flask_jwt_extended.exceptions import NoAuthorizationError


#! ==================
#! GENERAL ROUTE CONCERNS
@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404

# Setup our redis connection for storing the blocklisted tokens. You will probably
# want your redis instance configured to persist data to disk, so that a restart
# does not cause your application to forget that a JWT was revoked
jwt_redis_blocklist = redis.StrictRedis(
        host="localhost", port=6379, db=0, decode_responses=True
    )
# Callback function to check if a JWT exists in the redis blocklist
@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None

@app.before_request
def before_request():

    path_dict = {
        "coursesbyid": Course,
        "courses": Course,
        "topicbyid": Topic,
        "referencebyid": Reference,
        "notebyid": Note,
        "profilebyid": User,
        "profile": User,
        "references": Reference,
        "notes": Note,
        "topics": Topic,
        "login": User,
        "signup": User,
        # "quizzes": Quiz,
        # "quizzesbyid": Quiz,
    }

    try:
        id = request.view_args.get("id")
        print(id)
        ipdb.set_trace()
        if id is not None:
            record = get_instance_by_id(path_dict.get(request.endpoint), id)
            print(record)
            key_name = request.endpoint.split("byid")[0]
            ipdb.set_trace()
            setattr(g, key_name, record)
            ipdb.set_trace()
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
#     ipdb.set_trace()
#     return get_instance_by_id(User, identity)
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):

    ipdb.set_trace()
    identity = jwt_data["sub"]
    ipdb.set_trace()
    return get_instance_by_id(User, identity)
