from .. import (
    Resource,
    db,
    User,
    user_schema,
    users_schema,
    jwt_required,
    current_user,
    CourseSchema,
    TopicSchema,
    NoteSchema,
    UserSchema,
)


class CheckSession(Resource):

    # @jwt_required()
    # def get(self):
    #     #! check if we have a user_id key inside session
    #     if current_user:
    #         user_data = user_schema.dump(current_user)
    #         course_schema = CourseSchema()
    #         topic_schema = TopicSchema()
    #         user_data["created_courses"] = [
    #             course_schema.dump(course) for course in current_user.created_courses
    #         ]
    #         user_data["created_topics"] = [
    #             topic_schema.dump(topic) for topic in current_user.created_topics
    #         ]
    #         return user_data, 200
    #     else:
    #         return {"message": "Please log in"}, 401
    @jwt_required()
    def get(self):
        if current_user:
            user_data = UserSchema().dump(current_user)
            return user_data, 200
        else:
            return {"message": "Please log in"}, 401
