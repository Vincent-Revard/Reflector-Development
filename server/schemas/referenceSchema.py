from marshmallow import fields
from config import ma

from . import Reference


class ReferenceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reference
        load_instance = True
        exclude = ("user", "note_references")

    id = fields.Int()
    name = fields.Str()
    title = fields.Str()
    user_id = fields.Int()
    author_last = fields.Str()
    author_first = fields.Str()
    organization_name = fields.Str()
    container_name = fields.Str()
    publication_day = fields.Int()
    publication_month = fields.Str()
    publication_year = fields.Int()
    url = fields.Str()
    access_day = fields.Int()
    access_month = fields.Str()
    access_year = fields.Int()
