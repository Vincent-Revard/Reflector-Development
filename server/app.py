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
from routes.enrollment.enroll_course_or_topic import EnrollInCourseOrTopic
from routes.course.coursebyid import CourseById
from routes.topic.topics_by_id import TopicsById

api.add_resource(Signup, "/signup")
api.add_resource(CheckSession, "/check_session")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(Refresh, "/refresh")
api.add_resource(Verify, "/verify/<token>")
api.add_resource(CoursesIndex, "/courses", endpoint="courses")
api.add_resource(UsersIndex, "/profile", "/profile/<int:id>", endpoint="profile")
api.add_resource(
    NotesIndex, "/courses/<int:course_id>/topics/<int:topic_id>/notes", endpoint="notes"
)

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
    endpoint="topics",
)
api.add_resource(
    NotesById,
    "/courses/<int:course_id>/topics/<int:topic_id>/notes/<int:note_id>/edit",
    endpoint="note_edit",
)
api.add_resource(
    EnrollInCourseOrTopic,
    "/courses/enroll",
    "/courses/<int:course_id>/enroll",
    "/courses/<int:course_id>/unenroll",
    endpoint="enroll_in_course",
)
api.add_resource(
    EnrollInCourseOrTopic,
    "/courses/<int:course_id>/topics/enroll",
    "/courses/<int:course_id>/topics/<int:topic_id>/enroll",
    "/courses/<int:course_id>/topics/<int:topic_id>/unenroll",
    endpoint="enroll_in_topic",
)

api.add_resource(
    CourseById,
    "/courses/<int:course_id>",
    "/courses/<int:course_id>/edit",
    endpoint="course_by_id",
)

api.add_resource(
    TopicsById,
    "/courses/<int:course_id>/topics/<int:topic_id>",
    "/courses/<int:course_id>/topics/<int:topic_id>/edit",
    endpoint="topics_by_id",
)


if __name__ == "__main__":
    app.run(port=5555, debug=True)
