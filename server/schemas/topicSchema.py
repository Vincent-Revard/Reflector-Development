from marshmallow import fields, post_load
from config import ma
from . import Topic
from .noteSchema import NoteSchema
from .courseSchema import CourseSchema

class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        exclude = ("creator", "creator.created_courses")

    id = ma.auto_field()
    creator_id = fields.Integer(attribute="creator.id")
    creator = fields.Nested(
        "UserSchema", only=("id",), many=False,
    )
    name = ma.auto_field()
    notes = fields.Nested("NoteSchema", many=True)
    courses = fields.Nested("CourseSchema", many=True)

    @post_load
    def make_topic(self, data, **kwargs):
        return data
