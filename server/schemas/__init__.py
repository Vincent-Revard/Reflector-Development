#! need to import all of the models I will use a schema for
from models.course import Course
from models.coursetopic import CourseTopic
from models.reference import Reference
from models.notereference import NoteReference
from models.note import Note
from models.topic import Topic
from models.user import User
from models.usercourse import UserCourse


from .courseSchema import CourseSchema
from .topicSchema import TopicSchema
from .userSchema import UserSchema
from .notereferenceSchema import NoteReferenceSchema
from .usercourseSchema import UserCourseSchema


import ipdb
from config import ma, db
from flask_marshmallow import Marshmallow
from flask_marshmallow.sqla import SQLAlchemyAutoSchema, auto_field



# external libraries imports
from marshmallow import (
    validates,
    ValidationError,
    fields,
    validate,
    pre_load,
    pre_dump,
    post_load,
)
from marshmallow.validate import Length
