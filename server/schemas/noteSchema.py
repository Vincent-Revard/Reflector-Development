
from marshmallow import fields
from config import ma
from .userSchema import UserSchema
from .topicSchema import TopicSchema
from .notereferenceSchema import NoteReferenceSchema


from . import Note

class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Note
        load_instance = True

    user = fields.Nested(UserSchema)
    topic = fields.Nested(TopicSchema)
    note_references = fields.Nested(NoteReferenceSchema, many=True)
