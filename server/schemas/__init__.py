#! need to import all of the models I will use a schema for
from models.course import Course
from models.coursetopic import CourseTopic
from models.reference import Reference
from models.notereference import NoteReference
from models.note import Note
from models.topic import Topic
from models.user import User
from models.usercourse import UserCourse
import ipdb

from config import ma, db

# external libraries imports
from marshmallow import validates, ValidationError, fields, validate
