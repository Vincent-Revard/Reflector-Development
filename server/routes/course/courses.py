from .. import (
    request,
    CourseSchema,
    Course,
    g,
    BaseResource,
    jwt_required_modified,
)
from sqlalchemy.exc import IntegrityError
import ipdb

class CoursesIndex(BaseResource):
    model = Course
    schema = CourseSchema()

    @jwt_required_modified
    def get(self, id=None, condition=None):
        return super().get(id, condition)

    @jwt_required_modified
    def delete(self, id=None):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        ipdb.set_trace()
        return super().delete(id)

    @jwt_required_modified
    def patch(self, id):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        ipdb.set_trace()

        return super().patch(g.courses.id)

    @jwt_required_modified
    def post(self):
        if g.courses is None:
            return {"message": "Unauthorized"}, 401
        
        ipdb.set_trace()

        return super().post()
