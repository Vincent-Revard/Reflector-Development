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

    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"))

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

from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
    )
from .user import User


class UserCourse(db.Model):
    __tablename__ = "user_courses"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), primary_key=True)


from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)


class NoteReference(db.Model):
    __tablename__ = "note_references"

    note_id = db.Column(db.Integer, db.ForeignKey("notes.id"), primary_key=True)
    reference_id = db.Column(
        db.Integer, db.ForeignKey("references.id"), primary_key=True
    )
    note = db.relationship("Note", back_populates="note_references")
    reference = db.relationship("Reference", back_populates="note_references")

from marshmallow import fields
from config import ma


from . import CourseTopic


class CourseTopicSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CourseTopic
        load_instance = True

    course = fields.Nested("CourseSchema")
    topic = fields.Nested("TopicSchema")

from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)

from .notereference import NoteReference


class Note(db.Model):
    __tablename__ = "notes"

    name = db.Column(db.String(100), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey("topics.id"), nullable=False)
    # Define relationship with references through association table
    references = db.relationship("NoteReference", back_populates="note")
    # Define back reference to user
    note_references = db.relationship(
        "NoteReference", back_populates="note", overlaps="references"
    )
    user = db.relationship("User", back_populates="notes")
    # Define back reference to topic
    topic = db.relationship("Topic", back_populates="notes")

    references_proxy = association_proxy("references", "title")

from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)

from .notereference import NoteReference


class Reference(db.Model):
    __tablename__ = "references"

    name = db.Column(db.String(100), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    author_last = db.Column(db.String(100))  # Last name of the author(s)
    author_first = db.Column(db.String(100))  # First name of the author(s)
    organization_name = db.Column(
        db.String(100)
    )  # Name of the organization (if applicable)

    container_name = db.Column(db.String(100))  # Name of the website
    publication_day = db.Column(db.Integer)  # Day of publication
    publication_month = db.Column(db.String(3))  # Month of publication (abbreviated)
    publication_year = db.Column(db.Integer)  # Year of publication
    url = db.Column(db.String(255))  # Website link to the work
    access_day = db.Column(db.Integer)  # Day of access (optional)
    access_month = db.Column(db.String(3))  # Month of access (abbreviated, optional)
    access_year = db.Column(db.Integer)  # Year of access (optional)

    user = db.relationship("User", back_populates="references")
    note_references = db.relationship("NoteReference", back_populates="reference")
    notes = association_proxy("note_references", "note")

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
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    notes = db.relationship("Note", back_populates="topic", lazy=True)
    course_topics = db.relationship("CourseTopic", back_populates="topic")
    creator = db.relationship("User", back_populates="created_topics")

    users = db.relationship(
        "User",
        secondary="user_topics",
        back_populates="topics",
    )

    courses = db.relationship(
        "Course",
        secondary="course_topics",
        back_populates="topics",
        overlaps="course_topics",
    )
