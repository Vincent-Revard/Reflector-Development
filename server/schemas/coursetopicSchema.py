from marshmallow import fields
from config import ma


from . import CourseTopic

class CourseTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CourseTopic
        load_instance = True

    course = fields.Nested('CourseSchema')
    topic = fields.Nested('TopicSchema')

    

