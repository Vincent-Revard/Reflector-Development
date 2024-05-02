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
from models.usertopic import UserTopic

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
        emails = set()
        for _ in range(5):  # Create 5 users
            email = fake.email()
            while email in emails:
                email = fake.email()
            emails.add(email)
            user = User(username=fake.user_name(), email=email)
            user.password = "password"
            db.session.add(user)
            users.append(user)
        db.session.commit()

        for user in users:
            for _ in range(randint(2, 4)):  # Each user creates 2-4 courses
                course = Course(name=fake.job(), creator_id=user.id)  # Updated this line
                db.session.add(course)
                db.session.commit()
                user_course = UserCourse(user_id=user.id, course_id=course.id)
                db.session.add(user_course)
            db.session.commit()

        for course in Course.query.all():
            for _ in range(randint(2, 4)):  # Each course has 2-4 topics
                topic = Topic(name=fake.catch_phrase(), creator_id=course.creator_id)  # Updated this line
                db.session.add(topic)
                db.session.commit()
                course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                db.session.add(course_topic)
            db.session.commit()

        for user in users:
            for _ in range(randint(2, 4)):  # Each user enrolls in 2-4 courses
                course = rc(Course.query.all())
                ((ret,),) = db.session.query(
                    exists()
                    .where(UserCourse.user_id == user.id)
                    .where(UserCourse.course_id == course.id)
                )
                if not ret:
                    user_course = UserCourse(user_id=user.id, course_id=course.id)
                    db.session.add(user_course)
            db.session.commit()

        for topic in Topic.query.all():
            for _ in range(randint(2, 4)):  # Each topic is associated with 2-4 courses
                course = rc(Course.query.all())
                try:
                    course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                    db.session.add(course_topic)
                    db.session.commit()
                except IntegrityError:
                    db.session.rollback()

        for topic in Topic.query.all():
            for _ in range(randint(5, 10)):  # Each topic has 5-10 notes
                name = (
                    fake.first_name()
                    if fake.first_name() is not None
                    else "Default Name"
                )
                category = fake.catch_phrase()
                if category is None:
                    category = "default_category"
                note = Note(
                    name=name,
                    title=fake.sentence(),
                    content=fake.paragraph(),
                    user_id=topic.creator_id,  # Updated this line
                    topic_id=topic.id,
                    category=category,
                )
                db.session.add(note)
            db.session.commit()

        for user in User.query.all():
            for _ in range(randint(1, 5)):  # Each user is associated with 1-5 topics
                topic_name = fake.catch_phrase()
                topic = Topic.query.filter_by(name=topic_name).first()
                if not topic:
                    topic = Topic(name=topic_name, creator_id=user.id)
                    db.session.add(topic)
                    db.session.commit()
                user_topic = UserTopic(user_id=user.id, topic_id=topic.id)
                db.session.add(user_topic)
            db.session.commit()


        for user in users:
            for _ in range(randint(2, 4)):  # Each user creates 2-4 references
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

        for reference in Reference.query.all():
            for _ in range(
                randint(2, 4)
            ):  # Each reference is associated with 2-4 notes
                note = rc(Note.query.all())
                note_reference = NoteReference(
                    note_id=note.id, reference_id=reference.id
                )
                db.session.add(note_reference)
            db.session.commit()

        print("Seed completed!")
