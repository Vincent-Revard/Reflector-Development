from functools import wraps
from flask import request, g, render_template, make_response
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from .helpers.generate_csrf_token import generate_csrf_token
from .helpers.jwt_required_modified import jwt_required_modified
import json
from flask_mail import Mail, Message
from schemas.userupdateSchema import UserUpdateSchema
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from marshmallow import ValidationError, fields, validates, ValidationError, pre_load

from routes.utils.baseresource import BaseResource
# from models.production import Production
from models.user import User
from models.course import Course
from models.topic import Topic
from models.reference import Reference
from models.note import Note

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
    get_jwt,
    
)

#! ==================
#! GENERAL ROUTE CONCERNS
@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404

@app.before_request
def before_request():
    path_dict = {
        "coursebyid": Course,
        "topicbyid": Topic,
        "referencebyid": Reference,
        "notebyid": Note,
        "profilebyid": User,
    }
    if request.endpoint in path_dict:
        id = request.view_args.get("id")
        record = db.session.get(path_dict.get(request.endpoint), id)
        key_name = request.endpoint.split("byid")[0]
        setattr(g, key_name, record)

def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        # if "user_id" not in session:
        #     return {"message": "Access Denied, please log in!"}, 422
        return func(*args, **kwargs)

    return decorated_function

# Register a callback function that loads a user from your database whenever
# a protected route is accessed. This should return any python object on a
# successful lookup, or None if the lookup failed for any reason (for example
# if the user has been deleted from the database).
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return db.session.get(User, identity)
