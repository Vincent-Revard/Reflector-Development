from . import NoteReference
from config import ma
from marshmallow import fields


class NoteReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NoteReference
        load_instance = True
        fields = ("note_id", "reference_id")


    note = fields.Nested('NoteSchema')
