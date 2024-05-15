from marshmallow import fields
from config import ma

from . import (
    UserTopic
)

from .courseSchema import CourseSchema
from .coursetopicSchema import CourseTopicSchema



class UserTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserTopic
        load_instance = True
        include_fk = True

    user_id = fields.Int()
    topic_id = fields.Int()
    course_id = fields.Int()
    topic = fields.Nested(TopicMinimalSchema)
    course = fields.Nested(CourseMinimalSchema)
