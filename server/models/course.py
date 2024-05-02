from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)

from .usercourse import UserCourse

class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    creator = db.relationship("User", back_populates="created_courses")
    enrolled_users = db.relationship(
        "User", secondary="user_courses", back_populates="enrolled_courses"
    )
    course_topics = db.relationship("CourseTopic", back_populates="course")
    topics = db.relationship(
        "Topic",
        secondary="course_topics",
        back_populates="courses",
        overlaps="course_topics",
    )