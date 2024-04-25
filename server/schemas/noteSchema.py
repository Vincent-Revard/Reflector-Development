from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.note import Note
from .userSchema import UserSchema
from .topicSchema import TopicSchema
from .notereferenceSchema import NoteReferenceSchema

class NoteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Note
        load_instance = True

    user = fields.Nested(UserSchema)
    topic = fields.Nested(TopicSchema)
    note_references = fields.Nested(NoteReferenceSchema, many=True)
