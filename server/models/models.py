from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, flask_bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String(100), nullable=False)
    email_verified = db.Column(db.Boolean, default=False)

    notes = db.relationship("Note", back_populates="user", lazy=True)
    references = db.relationship("Reference", back_populates="user", lazy=True)

    created_courses = db.relationship("Course", backref="creator", lazy=True)
    enrolled_courses = db.relationship(
        "Course", secondary="user_courses", backref="enrolled_users"
    )
    notes_proxy = association_proxy("notes", "content")
    references_proxy = association_proxy("references", "title")

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Passwords cannot be inspected after being setup!")

    @password_hash.setter
    def password_hash(self, new_password):
        hashed_password = flask_bcrypt.generate_password_hash(new_password).decode('utf-8')
        self._password_hash = hashed_password

    def authenticate(self, password_to_check):
        return flask_bcrypt.check_password_hash(self._password_hash, password_to_check)


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    # Define relationship with topics

    course_topics = db.relationship("CourseTopic", back_populates="course")
    topics = association_proxy("course_topics", "topic")

class Topic(db.Model):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    # Define relationship with notes
    notes = db.relationship("Note", back_populates="topic", lazy=True)
    course_topics = db.relationship("CourseTopic", back_populates="topic")

    notes_proxy = association_proxy("notes", "content")
    courses = association_proxy("course_topics", "course")

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

class NoteReference(db.Model):
    __tablename__ = "note_references"

    note_id = db.Column(db.Integer, db.ForeignKey("notes.id"), primary_key=True)
    reference_id = db.Column(
        db.Integer, db.ForeignKey("references.id"), primary_key=True
    )
    note = db.relationship("Note", back_populates="note_references")
    reference = db.relationship("Reference", back_populates="note_references")


class UserCourse(db.Model):
    __tablename__ = "user_courses"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), primary_key=True)
    user = db.relationship("User", back_populates="user_courses")
    course = db.relationship("Course", back_populates="user_courses")


class CourseTopic(db.Model):
    __tablename__ = "course_topics"
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey("topics.id"), primary_key=True)
    course = db.relationship("Course", back_populates="course_topics")
    topic = db.relationship("Topic", back_populates="course_topics")
