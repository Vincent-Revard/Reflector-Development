from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.notereference import NoteReference

class NoteReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NoteReference
        load_instance = True
