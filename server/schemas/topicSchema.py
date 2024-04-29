from marshmallow import fields
from config import ma
from . import Topic, Note


class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True

    notes = fields.Nested("NoteSchema", many=True)
