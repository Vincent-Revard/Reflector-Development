from marshmallow import fields, post_load
from config import ma
from . import Topic


class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    notes = fields.Nested("NoteSchema", many=True)
    creating_user_id = fields.Integer(attribute="creator.id")
    courses = fields.Nested("CourseSchema", many=True)


    @post_load
    def make_topic(self, data, **kwargs):
        return data
