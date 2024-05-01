from . import db


class UserTopic(db.Model):
    __tablename__ = "user_topics"

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey("topics.id"), primary_key=True)
