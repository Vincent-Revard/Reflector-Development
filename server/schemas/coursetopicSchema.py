from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.coursetopic import CourseTopic
from .courseSchema import CourseSchema
from .topicSchema import TopicSchema
class CourseTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CourseTopic
        load_instance = True

    course = fields.Nested(CourseSchema)
    topic = fields.Nested(TopicSchema)
