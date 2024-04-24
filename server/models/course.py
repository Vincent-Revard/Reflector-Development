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
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    # Define relationship with topics

    course_topics = db.relationship("CourseTopic", back_populates="course")
    user_courses = db.relationship("UserCourse", back_populates="course")
