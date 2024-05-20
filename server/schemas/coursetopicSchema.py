from marshmallow import fields
from config import ma


from . import CourseTopic


class CourseTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CourseTopic
        load_instance = True

    course = fields.String(attribute="course.name")