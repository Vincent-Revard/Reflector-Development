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
from routes.auth.verify import Verify
from routes.user.usersindex import UsersIndex
from routes.course.courses import CoursesIndex


api.add_resource(Signup, "/signup")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(Refresh, "/refresh")
api.add_resource(Verify, "/verify/<token>")
api.add_resource(CoursesIndex, "/courses", "/courses/<int:id>", endpoint="courses")
api.add_resource(UsersIndex, "/profile", "/profile/<int:id>", endpoint="profile")


if __name__ == "__main__":
    app.run(port=5555, debug=True)