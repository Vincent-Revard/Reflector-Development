from .. import (
    request,
    CourseSchema,
    Course,
    g,
    BaseResource,
    jwt_required_modified,
    get_related_data,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    get_jwt_identity,
)
from sqlalchemy.exc import IntegrityError
import ipdb

class CoursesIndex(BaseResource):
    model = Course
    schema = CourseSchema()

    @jwt_required_modified
    def get(self, id=None, condition=None):
        if id is None:
            user_id = get_jwt_identity()
            user = get_related_data(
                user_id, User, UserCourse, Course, CourseTopic, Topic
            )
            courses = [user_course.course for user_course in user.user_courses]
            return self.schema.dump(courses, many=True), 200

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
