from marshmallow import fields, post_load
from config import ma
from . import Topic
from .noteSchema import NoteSchema
from .courseSchema import CourseSchema
from .coursetopicSchema import CourseTopicSchema

class TopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Topic
        load_instance = True
        exclude = ("creator",)

    id = ma.auto_field()
    creator_id = ma.auto_field()
    name = ma.auto_field()
    notes = fields.Nested("NoteSchema", many=True, exclude=('topic'))
    course_topics = fields.Nested("CourseTopicSchema", many=True)

    def get_course_topics(self, obj):
        course_id = self.context.get('course_id')
        return CourseTopicSchema(many=True).dump([ct for ct in obj.course_topics if ct.course_id == course_id])

    @post_load
    def make_topic(self, data, **kwargs):
        return data
