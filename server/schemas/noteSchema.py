from marshmallow import fields, post_load, post_dump
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
    topic = fields.Nested("TopicSchema")
    references = fields.Nested("ReferenceSchema", many=True)

    @post_dump
    def remove_empty_references(self, data, **kwargs):
        if "references" in data and not data["references"]:
            data.pop("references")
        return data

    @post_load
    def make_note(self, data, **kwargs):
        return data
