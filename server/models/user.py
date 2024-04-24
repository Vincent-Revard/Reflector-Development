from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String(100), nullable=False)
    # Define relationship with notes

    notes = db.relationship("Note", back_populates="user", lazy=True)
    # Define relationship with courses through association table
    user_courses = db.relationship("UserCourse", back_populates="user", lazy=True)
    references = db.relationship("Reference", back_populates="user", lazy=True)
    courses = association_proxy("user_courses", "course")

    # seriailze_rules = ('-_password_hash')

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Passwords cannot be inspected after being setup!")

    @password_hash.setter
    def password_hash(self, new_password):
        hashed_password = flask_bcrypt.generate_password_hash(new_password).decode(
            "utf-8"
        )
        self._password_hash = hashed_password

    def authenticate(self, password_to_check):
        return flask_bcrypt.check_password_hash(self._password_hash, password_to_check)
