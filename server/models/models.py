from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from config import db, flask_bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String(100), nullable=False)

    notes = db.relationship('Note', back_populates='user', lazy=True)
    references = db.relationship('Reference', back_populates='user', lazy=True)
    user_courses = db.relationship('UserCourse', back_populates='user')
    note_references = db.relationship('NoteReference', back_populates='user')

    courses = association_proxy('user_courses', 'course')
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
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # Define relationship with topics

    course_topics = db.relationship('CourseTopic', back_populates='course')
    user_courses = db.relationship("UserCourse", back_populates='course')

    topics = association_proxy("course_topics", "topic")

class Topic(db.Model):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Define relationship with notes
    notes = db.relationship('Note', back_populates='topic', lazy=True)
    course_topics = db.relationship('CourseTopic', back_populates='topic')

    notes_proxy = association_proxy("notes", "content")
    courses = association_proxy("course_topics", "course")

class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    # Define relationship with references through association table
    references = db.relationship('Reference', secondary='note_reference', back_populates='notes', lazy=True)
    # Define back reference to user
    note_references = db.relationship('NoteReference', back_populates='note')
    user = db.relationship('User', back_populates='notes')
    # Define back reference to topic
    topic = db.relationship('Topic', back_populates='notes')

    references_proxy = association_proxy("references", "title")

class Reference(db.Model):
    __tablename__ = 'references'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='references')

    note_references = db.relationship("NoteReference", back_populates="reference")

class NoteReference(db.Model):
    __tablename__ = 'note_references'

    note_id = db.Column(db.Integer, db.ForeignKey('notes.id'), primary_key=True)
    reference_id = db.Column(db.Integer, db.ForeignKey('references.id'), primary_key=True)
    note = db.relationship("User", back_populates="note_references")
    reference = db.relationship('Reference', back_populates='note_references')

class UserCourse(db.Model):
    __tablename__ = 'user_courses'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), primary_key=True)
    user = db.relationship('User', back_populates='user_courses')
    course = db.relationship('Course', back_populates='user_courses')

class CourseTopic(db.Model):
    __tablename__ = 'course_topics'
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), primary_key=True)
    course = db.relationship('Course', back_populates='course_topics')
    topic = db.relationship('Topic', back_populates='course_topics')
