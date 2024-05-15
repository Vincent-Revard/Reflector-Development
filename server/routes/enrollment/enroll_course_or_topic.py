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
    jwt_required,
    UserTopic,
)

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
            # Get all topics in the course that the user is associated with and sort them
            associated_topics = (
                Topic.query.join(UserTopic)
                .filter(
                    UserTopic.course_id == course_id,
                    UserTopic.user_id == user.id,
                )
                .order_by(Topic.name)
                .all()
            )
            associated_topics_data = [
                {
                    "id": topic.id,
                    "creator_id": topic.creator_id,
                    "name": topic.name,
                }
                for topic in associated_topics
            ]
            # Get all topics in the course that the user is not associated with and sort them
            not_associated_topics = (
                Topic.query.filter(
                    ~Topic.id.in_(
                        db.session.query(UserTopic.topic_id)
                        .filter(
                            UserTopic.course_id == course_id,
                            UserTopic.user_id == user.id,
                        )
                    )
                )
                .order_by(Topic.name)
                .all()
            )
            not_associated_topics_data = [
                {
                    "id": topic.id,
                    "creator_id": topic.creator_id,
                    "name": topic.name,
                }
                for topic in not_associated_topics
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
            db.session.commit()  # Commit the course to the database
        elif course_id is not None and topic_id is not None:
            # Associate the user with the topic in the course
            topic = Topic.query.get(topic_id)
            if not topic:
                return {"message": "Topic not found"}, 404
            user_topic = UserTopic(user_id=user.id, topic_id=topic.id, course_id=course_id)
            db.session.add(user_topic)
        # Check if the course-topic association exists in the CourseTopic table
            course_topic = CourseTopic.query.filter_by(
                course_id=course_id, topic_id=topic_id
            ).first()
            if not course_topic:
                # If it doesn't exist, create it
                course_topic = CourseTopic(course_id=course_id, topic_id=topic_id)
                db.session.add(course_topic)
            db.session.commit()  # Commit the course to the database
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
            user_topic = UserTopic.query.filter_by(
                user_id=user.id, topic_id=topic_id, course_id=course_id
            ).first()
            if not user_topic:
                return {"message": "User-Topic association not found"}, 404
            db.session.delete(user_topic)

        db.session.commit()
        return {"message": "Operation successful"}, 200