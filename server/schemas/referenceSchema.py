from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.reference import Reference
from .notereferenceSchema import NoteReferenceSchema
from .userSchema import UserSchema

class ReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reference
        load_instance = True

    user = fields.Nested(UserSchema)
    note_references = fields.Nested(NoteReferenceSchema, many=True)
