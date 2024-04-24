from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)


class CourseTopic(db.Model):
    __tablename__ = "course_topics"
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey("topic.id"), primary_key=True)
    course = db.relationship("Course", back_populates="course_topics")
    topic = db.relationship("Topic", back_populates="course_topics")
