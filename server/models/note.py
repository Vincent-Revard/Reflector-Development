from . import (
    SerializerMixin,
    validates,
    re,
    db,
    association_proxy,
    hybrid_property,
    flask_bcrypt,
)


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey("topic.id"), nullable=False)
    # Define relationship with references through association table
    references = db.relationship(
        "Reference", secondary="note_reference", back_populates="notes", lazy=True
    )
    # Define back reference to user
    note_references = db.relationship("NoteReference", back_populates="note")
    user = db.relationship("User", back_populates="notes")
    # Define back reference to topic
    topic = db.relationship("Topic", back_populates="notes")
