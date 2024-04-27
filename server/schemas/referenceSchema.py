from marshmallow import fields, post_load
from config import ma
from .notereferenceSchema import NoteReferenceSchema

from . import Reference


class ReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reference
        load_instance = True

    user = fields.Nested("UserSchema")
    note_references = fields.Nested(NoteReferenceSchema, many=True)

    @post_load
    def make_reference(self, data, **kwargs):
        return Reference(**data)
