#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from sqlalchemy.sql import text
import redis
from sqlalchemy import exists
from sqlalchemy.exc import IntegrityError


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
        emails = set()  # Store all emails
        for _ in range(10):  # Create 10 users
            email = fake.email()
            while email in emails:  # Generate a new email if it already exists
                email = fake.email()
            emails.add(email)
            user = User(username=fake.user_name(), email=email)
            user.password = "password" 
            db.session.add(user)
            users.append(user)
        db.session.commit()

        # Create some courses
        for user in users:
            for _ in range(randint(5, 10)):  # Each user creates 5-10 courses
                course = Course(name=fake.job(), user_id=user.id)
                db.session.add(course)
                db.session.commit()  # Commit the course to the database to get its ID
                user_course = UserCourse(user_id=user.id, course_id=course.id)
                db.session.add(user_course)
            db.session.commit()

        # Create some topics
        for course in Course.query.all():
            for _ in range(randint(5, 10)):  # Each course has 5-10 topics
                topic = Topic(name=fake.catch_phrase(), user_id=course.user_id)
                db.session.add(topic)
                db.session.commit()  # Commit the topic to the database to get its ID
                course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                db.session.add(course_topic)
            db.session.commit()

        # Users can enroll in courses
        for user in users:
            for _ in range(randint(5, 10)):  # Each user enrolls in 5-10 courses
                course = rc(Course.query.all())
                # Check if the record already exists
                (ret, ), = db.session.query(exists().where(UserCourse.user_id == user.id).where(UserCourse.course_id == course.id))
                # If the record does not exist, insert it
                if not ret:
                    user_course = UserCourse(user_id=user.id, course_id=course.id)
                    db.session.add(user_course)
            db.session.commit()

        # Topics can be associated with many courses
# Topics can be associated with many courses
        for topic in Topic.query.all():
            for _ in range(randint(5, 10)):  # Each topic is associated with 5-10 courses
                course = rc(Course.query.all())
                try:
                    # Try to insert the new record.
                    course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                    db.session.add(course_topic)
                    db.session.commit()
                except IntegrityError:
                    # If a record with the same course_id and topic_id already exists,
                    # rollback the session to the state before the failed insertion.
                    db.session.rollback()

        # Create some notes
        for topic in Topic.query.all():
            for _ in range(randint(20, 30)):  # Each topic has 20-30 notes
                name = fake.first_name() if fake.first_name() is not None else "Default Name"
                category = fake.catch_phrase()
                if category is None:
                    category = 'default_category'  # Replace 'default_category' with a suitable default
                note = Note(
                    name=name,
                    title=fake.sentence(),
                    content=fake.paragraph(),
                    user_id=topic.user_id,
                    topic_id=topic.id,
                    category=category,
                )
                db.session.add(note)
            db.session.commit()

        # Create some references
        for user in users:
            for _ in range(randint(5, 10)):  # Each user creates 5-10 references
                reference = Reference(
                    name=fake.first_name(),
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
                    user_id=user.id,
                )
                db.session.add(reference)
            db.session.commit()

        # References can be associated with many notes
        for reference in Reference.query.all():
            for _ in range(randint(5, 10)):  # Each reference is associated with 5-10 notes
                note = rc(Note.query.all())
                note_reference = NoteReference(note_id=note.id, reference_id=reference.id)
                db.session.add(note_reference)
            db.session.commit()

        print("Seed completed!")
