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
    __tablename__ = 'user_courses'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), primary_key=True)
    user = db.relationship('User', back_populates='user_courses')
    course = db.relationship('Course', back_populates='user_courses')
