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
    references = db.relationship(
        "NoteReference", back_populates="note"
    )
    user = db.relationship("User", back_populates="notes")
    topic = db.relationship("Topic", back_populates="notes")

    references_proxy = association_proxy("references", "title")
