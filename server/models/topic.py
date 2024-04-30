from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)


class Topic(db.Model):
    __tablename__ = "topics"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    # Define relationship with notes
    notes = db.relationship("Note", back_populates="topic", lazy=True)
    course_topics = db.relationship("CourseTopic", back_populates="topic")

    courses = db.relationship(
        "Course",
        secondary="course_topics",
        back_populates="topics",
        overlaps="course_topics",
    )
