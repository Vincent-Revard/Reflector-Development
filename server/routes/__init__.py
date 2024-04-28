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
from routes.helpers.query_helpers import get_all, get_all_by_condition, get_instance_by_id, get_one_by_condition

from schemas.userSchema import user_schema, users_schema
import ipdb
from models.user import User
from config import db, app, jwt, redis_client, mail
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

    # identity = None
    # ipdb.set_trace()

    # ]:
    #     try:
    #         ipdb.set_trace()
    #         verify_jwt_in_request()
    #         ipdb.set_trace()
    #         identity = get_jwt_identity()
    #         ipdb.set_trace()
    #     except NoAuthorizationError:
    #         pass
    # if request.endpoint in [
    #         "courses",
    #         "coursesbyid",
    #         "references",
    #         "notes",
    #         "topics",
    #         "quizzes",
    #     ]:
            # Fetch the user's data using the identity
            # if request.path not in [
            #     "/api/v1/login",
            #     "/api/v1/signup",
            # ]:
            #     try:
            #         verify_jwt_in_request()
            #         identity = get_jwt_identity()
            #         user_data = get_all_by_condition(
            #             path_dict.get(request.endpoint), {"user_id": identity}
            #         )

            #         # Set the user's data in the global object
            #         g.data = user_data
            #         ipdb.set_trace()


            #     except NoAuthorizationError:
            #         pass

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
    identity = jwt_data["sub"]
    ipdb.set_trace()
    return get_instance_by_id(User, identity)
