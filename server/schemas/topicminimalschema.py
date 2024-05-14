from config import ma


from . import Topic


class TopicMinimalSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        exclude = ("creator",)
