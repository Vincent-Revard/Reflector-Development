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
    # Define back reference to user
    note_references = db.relationship(
        "NoteReference", back_populates="note", overlaps="references"
    )
    user = db.relationship("User", back_populates="notes")
    # Define back reference to topic
    topic = db.relationship("Topic", back_populates="notes")

    references_proxy = association_proxy("references", "title")















class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


class Solution:
    def isPalindrome(self, head):
        slow = fast = head
        # find the mid node
        while fast and fast.next:
            fast = fast.next.next
            slow = slow.next
        # reverse the second half
        node = None
        prev = None
        while slow:
            node = slow
            slow = slow.next
            node.next = prev
            prev = node
        # compare the first and second half nodes
        while node:  # while node and head:
            if node.val != head.val:
                return False
            node = node.next
            head = head.next
        return True
