from marshmallow import fields
from config import ma

from . import Reference


class ReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reference
        load_instance = True

    user = fields.Nested("UserSchema")
    note_references = fields.Nested('NoteReferenceSchema', many=True)

