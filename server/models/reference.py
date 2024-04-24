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

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="references")

    note_references = db.relationship("NoteReference", back_populates="reference")
    notes = association_proxy("note_references", "note")
