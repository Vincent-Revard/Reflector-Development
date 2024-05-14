
from config import ma


from . import Course


class CourseMinimalSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Course
        load_instance = True
        exclude = ("creator",)
