from marshmallow import fields, post_load
from config import ma

from .userSchema import UserSchema
from .notereferenceSchema import NoteReferenceSchema


from . import Note

class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Note
        load_instance = True

    content = ma.auto_field()
    category = ma.auto_field()
    user = fields.Nested('UserSchema')
    # topic = fields.Nested('TopicSchema')
    note_references = fields.Nested('NoteReferenceSchema', many=True)

    @post_load
    def make_note(self, data, **kwargs):
        return data
