#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from sqlalchemy.sql import text
import redis

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

        r = redis.Redis(host='localhost', port=6379, db=0)  # Connect to your Redis instance
        r.flushall()  # Clear all data in Redis

        # Create some users
        users = []
        for _ in range(10):
            user = User(username=fake.user_name(), email=fake.email())
            user.password = "password"
            db.session.add(user)
            users.append(user)
        db.session.commit()

        # Create some courses
        courses = []
        for _ in range(5):
            course = Course(name=fake.word(), user_id=rc(users).id)
            db.session.add(course)
            courses.append(course)

        # Create some topics
        topics = []
        for _ in range(10):
            topic = Topic(name=fake.word(), user_id=rc(users).id)
            db.session.add(topic)
            topics.append(topic)
        db.session.commit()  # Ensure topics are committed to the database

        # Create some notes
        for _ in range(20):
            note = Note(
                title=fake.sentence(),
                content=fake.text(),
                user_id=rc(users).id,
                topic_id=rc(topics).id,  # Now this should not be None
            )
            db.session.add(note)
        db.session.commit()  # Commit notes to the database

        # Create some references
        for _ in range(15):
            reference = Reference(
                title=fake.sentence(),
                author_last=fake.last_name(),
                author_first=fake.first_name(),
                organization_name=fake.company(),
                container_name=fake.domain_name(),
                publication_day=fake.day_of_month(),
                publication_month=fake.month_name()[:3],
                publication_year=fake.year(),
                url=fake.url(),
                access_day=fake.day_of_month(),
                access_month=fake.month_name()[:3],
                access_year=fake.year(),
                user_id=rc(users).id,
            )
            db.session.add(reference)

        # Create some note references
        for _ in range(10):
            note_reference = NoteReference(
                note_id=rc(Note.query.all()).id,
                reference_id=rc(Reference.query.all()).id,
            )
            db.session.add(note_reference)

        # Create some user courses
        user_course_combinations = set()
        for _ in range(10):
            user_id = rc(users).id
            course_id = rc(courses).id
            if (user_id, course_id) not in user_course_combinations:
                user_course_combinations.add((user_id, course_id))
                user_course = UserCourse(user_id=user_id, course_id=course_id)
                db.session.add(user_course)

        # Create some course topics
        course_topic_combinations = set()
        for _ in range(10):
            course_id = rc(courses).id
            topic_id = rc(topics).id
            if (course_id, topic_id) not in course_topic_combinations:
                course_topic_combinations.add((course_id, topic_id))
                course_topic = CourseTopic(course_id=course_id, topic_id=topic_id)
                db.session.add(course_topic)

        # Commit the changes
        db.session.commit()
