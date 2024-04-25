#!/usr/bin/env python3

# Standard library imports

# Remote library imports
import ipdb

from config import app, api

from routes.auth.login import Login
from routes.auth.logout import Logout
from routes.auth.check_session import CheckSession
from routes.auth.refresh import Refresh
from routes.auth.signup import Signup



api.add_resource(Signup, "/signup")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(Refresh, "/refresh")


if __name__ == "__main__":
    app.run(port=5555, debug=True)


# import traceback
# from flask import request, g, render_template, make_response, session
# from time import time
# from flask_restful import Resource
# from werkzeug.exceptions import NotFound, BadRequest
# from sqlalchemy import select
# import ipdb

# from functools import wraps

# # Local imports
# from config import app, db, api
# # Add your model imports
# from models import (
#     User,
#     Course,
#     CourseTopic,
#     Reference,
#     NoteReference,
#     Note,
#     Topic,
#     UserCourse,
# )

# from models import course, coursetopic, reference, notereference, note, topic, user, usercourse
#! need to import both models and schema's here as necessary
# from schemas import courseSchema, coursetopicSchema, notereferenceSchema, noteSchema, referenceSchema, topicSchema, usercourseSchema, userSchema

# from schemas.userSchema import UserSchema


# #! helpers
# def execute_query(query):
#     return db.session.execute(query).scalars()

# def get_all(model):
#     # return db.session.execute(select(model)).scalars().all()
#     return execute_query(select(model)).all()

# def get_instance_by_id(model, id):
#     return db.session.get(model, id)

# def get_one_by_condition(model, condition):
#     # stmt = select(model).where(condition)
#     # result = db.session.execute(stmt)
#     # return result.scalars().first()
#     return execute_query(select(model).where(condition)).first()


# def get_all_by_condition(model, condition):
#     # stmt = select(model).where(condition)
#     # result = db.session.execute(stmt)
#     # return result.scalars().all()
#     return execute_query(select(model).where(condition)).all()

# #! GENERAL ROUTE CONCERNS
# @app.errorhandler(NotFound)
# def not_found(error):
#     return {"error": error.description}, 404

# @app.errorhandler(BadRequest)
# def handle_bad_request(error):
#     return {"error": "Bad request: " + str(error)}, 400

#     # @app.before_request
#     # def before_request():
#     #! First refactor when inserting crew routes BUT not very DRY right?
#     # if request.endpoint == "productionbyid":
#     #     id = request.view_args.get("id")
#     #     prod = db.session.get(Production, id)
#     #     g.prod = prod
#     # elif request.endpoint == "crewmemberbyid":
#     #     id = request.view_args.get("id")
#     #     crew = db.session.get(CrewMember, id)
#     #     g.crew = crew
#     #! Better Approach
#     # path_dict = {"productionbyid": Production, "crewmemberbyid": CrewMember}
#     # if request.endpoint in path_dict:
#     #     id = request.view_args.get("id")
#     #     record = db.session.get(path_dict.get(request.endpoint), id)
#     #     key_name = "prod" if request.endpoint == "productionbyid" else "crew"
#     #     setattr(g, key_name, record)

#     #! calculate current time
#     #! set it on g
#     # g.time = time()
#     # if request.endpoint not in ['login', 'signup']:
#     #     if 'user_id' not in session:
#     #         return {"message": "Access Denied, please log in!"}, 422


# # def login_required(func):
# #     @wraps(func)
# #     def decorated_function(*args, **kwargs):
# #         if "user_id" not in session:
# #             return {"message": "Access Denied, please log in!"}, 422
# #         return func(*args, **kwargs)


# #     return decorated_function
# @app.before_request
# def start_timer():
#     g.time = time()

# @app.before_request
# def load_logged_in_user():
#     user_id = session.get("user_id")
#     if user_id is None:
#         g.user = None
#     else:
#         g.user = get_instance_by_id(User, user_id)


# @app.after_request
# def after_request(response):  #! notice the response argument automatically passsed in
#     diff = time() - g.time
#     print(f"Request took {diff} seconds")
#     response.headers["X-Response-Time"] = str(diff)
#     response.set_cookie("max-reads", "3")
#     return response


# # Views go here!

# # ? User Account Signup/Login/Logout/Session Resources
# class Signup(Resource):
#     model = User
#     schema = UserSchema()

#     def post(self):
#         try:
#             self.schema.context = {"is_signup": True}

#             data = self.schema.load(request.get_json())

#             # password = data.pop("password_hash")

#             user = User(**data)
#             user.password_hash = data["password_hash"]

#             db.session.add(user)
#             db.session.commit()
#             # Log the user in
#             session["user_id"] = user.id
#             g.user = user

#             return self.schema.dump(user), 201
#         except Exception as e:
#             return {"message": str(e)}, 422
# class CheckSession(Resource):

#     def get(self):
#         if g.user is None:
#             return {"message": "Unauthorized"}, 401
#         return {
#             "id": g.user.id,
#             "username": g.user.username,
#         }, 200

# # class Refresh(Resource):
# #     model = User
# #     schema = UserSchema()

# #     @jwt_required(refresh=True)
# #     def post(self):
# #         new_access_token = create_access_token(identity=current_user.id)
# #         response = make_response(self.schema.dump(current_user), 200)
# #         set_access_cookies(response, new_access_token)
# #         return response

# class Login(Resource):
#     model = User
#     schema = UserSchema()

#     def post(self):
#         try:
#             self.schema.context = {"is_signup": False}
#             request_data = request.get_json()
#             data = self.schema.load(request_data)
#             username = data.username
#             password = request_data.get("password")
#             user = get_one_by_condition(User, User.username == username)
#             if user is None or not user.authenticate(password):
#                 return {"message": "Invalid credentials"}, 401

#             # access_token = create_access_token(identity=user.id)
#             # refresh_token = create_refresh_token(identity=user.id)
#             # response = make_response(self.schema.dump(user),201)
#             # set_access_cookies(response, access_token)
#             # set_refresh_cookies(response, refresh_token)
#             # return response
#             session["user_id"] = user.id
#             g.user = user
#             return {"id": user.id}, 200
#         except Exception as e:
#             return {"message": str(e)}, 422

# class Logout(Resource):
#     def delete(self):
#         try:
#             # response = make_response({}, 204)
#             # unset_access_cookies(response)
#             # return response
#             if (user_id := session.get("user_id")) is None:
#                 return {"message": "Unauthorized"}, 401
#             session["user_id"] = None
#             session["username"] = None
#             return {}, 204
#         except Exception as e:
#             raise e

# api.add_resource(Refresh, "/refresh")

# api.add_resource(Signup, "/signup")
# api.add_resource(CheckSession, "/check_session")
# api.add_resource(Login, "/login")
# api.add_resource(Logout, "/logout")
# api.add_resource(Refresh, "/refresh")


# if __name__ == '__main__':
#     app.run(port=5555, debug=True)
