from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
import ipdb

from .. import (
    request,
    NoteSchema,
    Note,
    g,
    BaseResource,
    jwt_required_modified,
    get_related_data,
    User,
    UserCourse,
    CourseTopic,
    Topic,
    get_jwt_identity,
    Course,
    TopicSchema
)

class TopicsIndex(BaseResource):
    model = Topic
    schema = TopicSchema()

    @jwt_required_modified
    def get(self, course_id, id=None, condition=None):
        # Similar logic as CoursesIndex.get
        pass

    @jwt_required_modified
    def delete(self, course_id, id=None):
        # Similar logic as CoursesIndex.delete
        pass

    @jwt_required_modified
    def patch(self, course_id, id):
        # Similar logic as CoursesIndex.patch
        pass

    @jwt_required_modified
    def post(self, course_id):
        # Similar logic as CoursesIndex.post
        pass
