


class CourseById(BaseResource):
    model = Course
    schema = course_schema

    def get(self, id):
        if g.course:
            return super().get(id)
        return {"message": f"Could not find Course with id #{id}"}, 404

    def patch(self, id):
        if g.course:
            return super().patch(id)
        return {"message": f"Could not find Course with id #{id}"}, 404

    def delete(self, id):
        if g.course:
            return super().delete(id)
        return {"message": f"Could not find Course with id #{id}"}, 404

    def post(self):
        return super().post()
