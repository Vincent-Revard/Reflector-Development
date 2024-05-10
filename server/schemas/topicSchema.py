from marshmallow import fields, post_load
from config import ma
from . import Topic
from .noteSchema import NoteSchema
from .courseSchema import CourseSchema

class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        exclude = ("creator",)

    id = ma.auto_field()
    creator_id = ma.auto_field()
    name = ma.auto_field()
    notes = fields.Nested("NoteSchema", many=True, exclude=('topic'))

    @post_load
    def make_topic(self, data, **kwargs):
        return data
