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
from routes.note.notesindex import NotesIndex
from routes.topic.topicsindex import TopicsIndex
from routes.note.notesbyid import NotesById

api.add_resource(Signup, "/signup")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(Refresh, "/refresh")
api.add_resource(Verify, "/verify/<token>")
api.add_resource(CoursesIndex, "/courses", "/courses/<int:id>", endpoint="courses")
api.add_resource(UsersIndex, "/profile", "/profile/<int:id>", endpoint="profile")
api.add_resource(NotesIndex, "/courses/<int:course_id>/topics/<int:topic_id>/notes", endpoint='notes')
api.add_resource(
    NotesById,
    "/courses/<int:course_id>/topics/<int:topic_id>/notes/<int:note_id>",
    endpoint="notes_by_id",
)
api.add_resource(
    NotesIndex,
    "/courses/<int:course_id>/topics/<int:topic_id>/notes/new",
    endpoint="notes_new",
)
api.add_resource(
    TopicsIndex,
    "/courses/<int:course_id>/topics",
    "/courses/<int:course_id>/topics/<int:id>",
    endpoint="topics",
)
api.add_resource(
    NotesById,
    "/courses/<int:course_id>/topics/<int:topic_id>/notes/<int:note_id>/edit",
    endpoint="note_edit",
)

# api.add_resource(NotesById, "/notes/<int:id>/edit", endpoint="notes_by_id")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
