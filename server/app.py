#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import traceback
from flask import request, g, render_template, make_response, session
from time import time
from flask_restful import Resource
from werkzeug.exceptions import NotFound, BadRequest
from sqlalchemy import select

from functools import wraps

# Local imports
from config import app, db, api
# Add your model imports
from models.course import Course
from models.coursetopic import CourseTopic
from models.reference import Reference
from models.notereference import NoteReference
from models.note import Note
from models.topic import Topic
from models.user import User
from models.usercourse import UserCourse


# from models import course, coursetopic, reference, notereference, note, topic, user, usercourse
#! need to import both models and schema's here as necessary
# from schemas import courseSchema, coursetopicSchema, notereferenceSchema, noteSchema, referenceSchema, topicSchema, usercourseSchema, userSchema

from schemas.userSchema import UserSchema


#! helpers
def execute_query(query):
    return db.session.execute(query).scalars()

def get_all(model):
    # return db.session.execute(select(model)).scalars().all()
    return execute_query(select(model)).all()

def get_instance_by_id(model, id):
    return db.session.get(model, id)

def get_one_by_condition(model, condition):
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().first()
    return execute_query(select(model).where(condition)).first()


def get_all_by_condition(model, condition):
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().all()
    return execute_query(select(model).where(condition)).all()

#! GENERAL ROUTE CONCERNS
@app.errorhandler(NotFound)
def not_found(error):
    return {"error": error.description}, 404

@app.errorhandler(BadRequest)
def handle_bad_request(error):
    return {"error": "Bad request: " + str(error)}, 400

    # @app.before_request
    # def before_request():
    #! First refactor when inserting crew routes BUT not very DRY right?
    # if request.endpoint == "productionbyid":
    #     id = request.view_args.get("id")
    #     prod = db.session.get(Production, id)
    #     g.prod = prod
    # elif request.endpoint == "crewmemberbyid":
    #     id = request.view_args.get("id")
    #     crew = db.session.get(CrewMember, id)
    #     g.crew = crew
    #! Better Approach
    # path_dict = {"productionbyid": Production, "crewmemberbyid": CrewMember}
    # if request.endpoint in path_dict:
    #     id = request.view_args.get("id")
    #     record = db.session.get(path_dict.get(request.endpoint), id)
    #     key_name = "prod" if request.endpoint == "productionbyid" else "crew"
    #     setattr(g, key_name, record)

    #! calculate current time
    #! set it on g
    # g.time = time()
    # if request.endpoint not in ['login', 'signup']:
    #     if 'user_id' not in session:
    #         return {"message": "Access Denied, please log in!"}, 422


# def login_required(func):
#     @wraps(func)
#     def decorated_function(*args, **kwargs):
#         if "user_id" not in session:
#             return {"message": "Access Denied, please log in!"}, 422
#         return func(*args, **kwargs)

#     return decorated_function

@app.before_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        g.user = get_instance_by_id(User, user_id)


@app.after_request
def after_request(response):  #! notice the response argument automatically passsed in
    diff = time() - g.time
    print(f"Request took {diff} seconds")
    response.headers["X-Response-Time"] = str(diff)
    response.set_cookie("max-reads", "3")
    return response


# Views go here!

 ? User Account Signup/Login/Logout/Session Resources
class Signup(Resource):
    model = User
    schema = UserSchema()

    def post(self):
        self.schema.context = {"is_signup": True}
        data = request.get_json()

        try:
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 422

        password = data.pop("password_hash")

        user = User(**data)
        user.password_hash = password

        db.session.add(user)

        db.session.commit()
        # Log the user in
        session["user_id"] = user.id
        session["username"] = user.username
        g.user = user

        return self.schema.dump(user), 201
class CheckSession(Resource):

    def get(self):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        return {
            "id": g.user.id,
            "username": g.user.username,
        }, 200

class Login(Resource):
    model = User
    schema = UserSchema()

    def post(self):
        data = request.get_json()
        try:
            data = self.schema.load(data)
        except ValidationError as err:
            return err.messages, 422
        username = data.get("username")
        password = data.get("password_hash")
        user = get_one_by_condition(User, User.username == username)
        if user is None or not user.authenticate(password):
            return {"message": "Invalid credentials"}, 401
        session["user_id"] = user.id
        session["username"] = user.username
        g.user = user
        return {"id": user.id, "username": user.username}, 200

class Logout(Resource):
    def delete(self):
        if (user_id := session.get("user_id")) is None:
            return {"message": "Unauthorized"}, 401
        session["user_id"] = None
        session["username"] = None
        return {}, 204



if __name__ == '__main__':
    app.run(port=5555, debug=True)
