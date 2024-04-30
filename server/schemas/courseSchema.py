from marshmallow import fields, post_load


from config import ma
from . import Course

class CourseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True

    id = ma.auto_field()
    user_courses = fields.Nested("UserCourseSchema", many=True)
    course_topics = fields.Nested("TopicSchema", many=True)
    notes = fields.Nested("NoteSchema", many=True)

    @post_load
    def make_course(self, data, **kwargs):
        return data
