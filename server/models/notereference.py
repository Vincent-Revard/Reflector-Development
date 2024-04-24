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
