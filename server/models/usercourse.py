from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)

class UserCourse(db.Model):
    __tablename__ = 'user_courses'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), primary_key=True)
    user = db.relationship('User', back_populates='user_courses')
    course = db.relationship('Course', back_populates='user_courses')