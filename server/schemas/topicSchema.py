from email_validator import validate_email, EmailNotValidError
from marshmallow import fields, validates, ValidationError
from marshmallow.validate import Length
from config import ma
from models.topic import Topic


class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
