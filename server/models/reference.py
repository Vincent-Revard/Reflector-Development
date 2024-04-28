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
    organization_name = db.Column(db.String(100))  # Name of the organization (if applicable)

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
