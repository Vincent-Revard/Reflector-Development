#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from config import app
from models.__init__ import db
from models.course import Course
from models.coursetopic import CourseTopic
from models.reference import Reference
from models.notereference import NoteReference
from models.note import Note
from models.topic import Topic
from models.user import User
from models.usercourse import UserCourse

#! IMPORT MODELS HERE AS NEEDED FOR SEEDING!

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

        User.query.delete()
        Course.query.delete()
        Topic.query.delete()
        Note.query.delete()
        Reference.query.delete()
        NoteReference.query.delete()
        UserCourse.query.delete()
        CourseTopic.query.delete()

        db.session.commit()

        # Create some users
        for _ in range(10):
            user = User(name=fake.name(), email=fake.email())
            user.password_hash = fake.password(length=12)
            db.session.add(user)
        db.session.commit()

        # Create some courses
        for _ in range(5):
            course = Course(name=fake.word(), user_id=fake.random_int(min=1, max=10))
            db.session.add(course)

        # Create some topics
        for _ in range(10):
            topic = Topic(name=fake.word(), user_id=fake.random_int(min=1, max=10))
            db.session.add(topic)

        # Create some notes
        for _ in range(20):
            note = Note(
                title=fake.sentence(),
                content=fake.text(),
                user_id=fake.random_int(min=1, max=10),
                topic_id=fake.random_int(min=1, max=10),
            )
            db.session.add(note)

        # Create some references
        for _ in range(15):
            reference = Reference(
                title=fake.sentence(),
                author=fake.name(),
                user_id=fake.random_int(min=1, max=10),
            )
            db.session.add(reference)

        # Create some note references
        for _ in range(10):
            note_reference = NoteReference(
                note_id=fake.random_int(min=1, max=20),
                reference_id=fake.random_int(min=1, max=15),
            )
            db.session.add(note_reference)

        # Create some user courses
        for _ in range(10):
            user_course = UserCourse(
                user_id=fake.random_int(min=1, max=10), course_id=fake.random_int(min=1, max=5)
            )
            db.session.add(user_course)

        # Create some course topics
        for _ in range(10):
            course_topic = CourseTopic(
                course_id=fake.random_int(min=1, max=5), topic_id=fake.random_int(min=1, max=10)
            )
            db.session.add(course_topic)

        # Commit the changes
        db.session.commit()
