from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from flask_jwt_extended import current_user

from flask import request
from .. import (
    db,
    User,
    g,
    BaseResource,
    UserCourse,
    Course,
    CourseTopic,
    Topic,
    CourseSchema,
    TopicSchema,
    CourseTopicSchema,
    UserSchema,
    not_,
    jwt_required
)

# class EnrollInCourseOrTopic(BaseResource):
#     model = Course

#     course_schema = CourseSchema()
#     topic_schema = TopicSchema()
#     course_topic_schema = CourseTopicSchema()
#     user_schema = UserSchema()

    # Get the current endpoint

    ##!new_user_course = UserCourse(user_id=user.id, course_id=course.id)
    # db.session.add(new_user_course)
    # db.session.commit()

    # @jwt_required()
    # def get(self, course_id=None, topic_id=None):
    #     user = current_user
    #     if not user:
    #         return {"message": "User not found"}, 404

    #     if course_id is None:
    #         # Get all courses and sort them
    #         courses = Course.query.order_by(Course.name).all()
    #         courses_data = [self.course_schema.dump(course) for course in courses]
    #         return {"courses": courses_data}
    #     elif topic_id is None:
    #         # Get all courses that the user is not enrolled in and sort them
    #         courses = (
    #             Course.query.filter(not_(Course.enrolled_users.any(id=user.id)))
    #             .order_by(Course.name)
    #             .all()
    #         )
    #         courses_data = [self.course_schema.dump(course) for course in courses]
    #         return {"courses": courses_data}
    # else:
    #     # Get all topics in the course that the user is not associated with and sort them
    #     topics = (
    #         Topic.query.join(CourseTopic)
    #         .filter(
    #             CourseTopic.course_id == course_id,
    #             not_(Topic.users.any(id=user.id)),
    #         )
    #         .order_by(Topic.name)
    #         .all()
    #     )
    #     topics_data = [self.topic_schema.dump(topic) for topic in topics]
    #     return {"topics": topics_data}

class EnrollInCourseOrTopic(BaseResource):
    model = Course

    course_schema = CourseSchema()
    topic_schema = TopicSchema()
    course_topic_schema = CourseTopicSchema()
    user_schema = UserSchema()

    @jwt_required()
    def get(self, course_id=None, topic_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if course_id is None and topic_id is None:
            # Get all courses that the user is not enrolled in and sort them
            not_enrolled_courses = (
                Course.query.filter(not_(Course.enrolled_users.any(id=user.id)))
                .order_by(Course.name)
                .all()
            )
            not_enrolled_courses_data = [
                self.course_schema.dump(course) for course in not_enrolled_courses
            ]

            # Get all courses that the user is enrolled in and sort them
            enrolled_courses = (
                Course.query.filter(Course.enrolled_users.any(id=user.id))
                .order_by(Course.name)
                .all()
            )
            enrolled_courses_data = [
                self.course_schema.dump(course) for course in enrolled_courses
            ]

            return {
                "not_enrolled_courses": not_enrolled_courses_data,
                "enrolled_courses": enrolled_courses_data,
            }
        elif course_id is not None and topic_id is None:
            # Get all topics in the course that the user is not associated with and sort them
            not_associated_topics = (
                Topic.query.join(CourseTopic)
                .filter(
                    CourseTopic.course_id == course_id,
                    not_(Topic.users.any(id=user.id)),
                )
                .order_by(Topic.name)
                .all()
            )
            not_associated_topics_data = [
                self.topic_schema.dump(topic) for topic in not_associated_topics
            ]

            # Get all topics in the course that the user is associated with and sort them
            associated_topics = (
                Topic.query.join(CourseTopic)
                .filter(
                    CourseTopic.course_id == course_id,
                    Topic.users.any(id=user.id),
                )
                .order_by(Topic.name)
                .all()
            )
            associated_topics_data = [
                self.topic_schema.dump(topic) for topic in associated_topics
            ]

            return {
                "not_associated_topics": not_associated_topics_data,
                "associated_topics": associated_topics_data,
            }

    @jwt_required()
    def post(self, course_id=None, topic_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if course_id is not None and topic_id is None:
            # Enroll the user in the course
            course = Course.query.get(course_id)
            if not course:
                return {"message": "Course not found"}, 404
            user.enrolled_courses.append(course)
        elif course_id is not None and topic_id is not None:
            # Associate the user with the topic in the course
            topic = Topic.query.get(topic_id)
            if not topic:
                return {"message": "Topic not found"}, 404
            user.topics.append(topic)

        db.session.commit()
        return {"message": "Operation successful"}, 200

    @jwt_required()
    def delete(self, course_id=None, topic_id=None):
        user = current_user
        if not user:
            return {"message": "User not found"}, 404

        if course_id is not None and topic_id is None:
            # Unenroll the user from the course
            course = Course.query.get(course_id)
            if not course:
                return {"message": "Course not found"}, 404
            user.enrolled_courses.remove(course)
        elif course_id is not None and topic_id is not None:
            # De-associate the user with the topic in the course
            topic = Topic.query.get(topic_id)
            if not topic:
                return {"message": "Topic not found"}, 404
            user.topics.remove(topic)

        db.session.commit()
        return {"message": "Operation successful"}, 200

    # @jwt_required()
    # def post(self, course_id, topic_id=None):
    #     user = current_user
    #     if not user:
    #         return {"message": "User not found"}, 404

    #     if topic_id is None:
    #         course = Course.query.get(course_id)
    #         if not course:
    #             return {"message": "Course not found"}, 404
    #         user_course = UserCourse(user_id=user.id, course_id=course.id)
    #         db.session.add(user_course)
    #         db.session.commit()
    #         return {
    #             "message": "Successfully enrolled in course",
    #             "user": self.user_schema.dump(user),
    #             "course": self.course_schema.dump(course),
    #         }, 200
    #     else:
    #         topic = Topic.query.get(topic_id)
    #         if not topic:
    #             return {"message": "Topic not found"}, 404
    #         course_topic = CourseTopic(user_id=user.id, topic_id=topic.id)
    #         db.session.add(course_topic)
    #         db.session.commit()
    #         return {
    #             "message": "Successfully enrolled in topic",
    #             "user": self.user_schema.dump(user),
    #             "topic": self.topic_schema.dump(topic),
    #         }, 200

    # @jwt_required()
    # def delete(self, course_id, topic_id=None):
    #     user = current_user
    #     if not user:
    #         return {"message": "User not found"}, 404

    #     if topic_id is None:
    #         user_course = UserCourse.query.filter_by(
    #             user_id=user.id, course_id=course_id
    #         ).first()
    #         if not user_course:
    #             return {"message": "Enrollment not found"}, 404
    #         db.session.delete(user_course)
    #         db.session.commit()
    #         return {"message": "Successfully unenrolled from course"}, 200
    #     else:
    #         course_topic = CourseTopic.query.filter_by(
    #             user_id=user.id, topic_id=topic_id
    #         ).first()
    #         if not course_topic:
    #             return {"message": "Enrollment not found"}, 404
    #         db.session.delete(course_topic)
    #         db.session.commit()
    #         return {"message": "Successfully unenrolled from topic"}, 200
