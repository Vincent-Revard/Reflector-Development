from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re
from config import db, flask_bcrypt

from .course import Course
from .coursetopic import CourseTopic
from .reference import Reference
from .notereference import NoteReference
from .note import Note
from .topic import Topic
from .user import User
from .usercourse import UserCourse
