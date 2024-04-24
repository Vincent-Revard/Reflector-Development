from marshmallow import Schema, fields, validates, ValidationError, pre_load, post_dump
from marshmallow.validate import Length
from server.models.models import User, Course, Topic
from sqlalchemy import select
