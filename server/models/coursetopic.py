from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)

from .course import Course
from .topic import Topic

class CourseTopic(db.Model):
    __tablename__ = "course_topics"

    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey("topics.id"), primary_key=True)
    course = db.relationship(
        "Course", back_populates="course_topics", overlaps="topics, courses"
    )
    topic = db.relationship(
        "Topic", back_populates="course_topics", overlaps="courses, topics"
    )
