#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
# Remote library imports
from faker import Faker
from sqlalchemy import exists
from sqlalchemy.exc import IntegrityError
from config import redis_client


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


if __name__ == "__main__":
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        UserTopic.query.delete()  # Add this line
        CourseTopic.query.delete()
        UserCourse.query.delete()
        Note.query.delete()
        Course.query.delete()
        Topic.query.delete()
        NoteReference.query.delete()
        Reference.query.delete()
        User.query.delete()

        db.session.commit()
        # r = redis.Redis(host='localhost', port=6379, db=0)  # Connect to your Redis instance
        # r.flushall()  # Clear all data in Redis
        # Use the Redis connection
        redis_client.flushall()  # Clear all data in Redis

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

        # Each user creates 2-4 courses and 1-3 topics for each course
        for user in users:
            for _ in range(randint(2, 4)):
                course = Course(name=fake.job())
                user.created_courses.append(course)
                db.session.add(course)
                db.session.commit()  # commit changes to the database to get course.id
                for _ in range(randint(1, 3)):
                    topic = Topic(name=fake.catch_phrase(), creator_id=user.id)
                    db.session.add(topic)
                    db.session.commit()  # commit changes to the database to get topic.id
                    course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                    db.session.add(course_topic)
            db.session.commit()  # commit all changes to the database once

        # Each user enrolls in 2-4 courses and creates 1-3 topics for each course
        for user in users:
            all_courses = Course.query.all()
            for _ in range(randint(2, 4)):
                course = rc(all_courses)
                if course not in user.enrolled_courses:
                    user.enrolled_courses.append(course)
                for _ in range(randint(1, 3)):
                    topic = Topic(name=fake.catch_phrase(), creator_id=user.id)
                    db.session.add(topic)
                    db.session.commit()  # commit here to ensure topic.id is generated
                    course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                    db.session.add(course_topic)
            db.session.commit()

        # # Each user is associated with 1-5 topics from the courses they are enrolled in
        # for user in User.query.all():
        #     enrolled_courses = (
        #         user.enrolled_courses
        #     )  # Access the courses directly from the User object
        #     used_combinations = set()
        #     for _ in range(randint(1, 5)):
        #         course = rc(enrolled_courses)  # Use the list of Course objects
        #         course_topics = CourseTopic.query.filter_by(course_id=course.id).all()
        #         course_topic = rc(course_topics)
        #         combination = (user.id, course_topic.topic_id, course.id)
        #         if combination in used_combinations:
        #             continue
        #         used_combinations.add(combination)
        #         user_topic = UserTopic(
        #             user_id=combination[0],
        #             topic_id=combination[1],
        #             course_id=combination[2],
        #         )
        #         db.session.add(user_topic)
        #     db.session.commit()
        for user in User.query.all():
            enrolled_courses = user.enrolled_courses
            for course in enrolled_courses:
                course_topics = CourseTopic.query.filter_by(course_id=course.id).all()
                for course_topic in course_topics:
                    user_topic = UserTopic.query.filter_by(user_id=user.id, topic_id=course_topic.topic_id, course_id=course.id).first()
                    if user_topic is None:
                        user_topic = UserTopic(user_id=user.id, topic_id=course_topic.topic_id, course_id=course.id)
                        db.session.add(user_topic)
            db.session.commit()

        for topic in Topic.query.all():
            for _ in range(randint(2, 4)):  # Each topic is associated with 2-4 courses
                course = rc(Course.query.all())
                ((ret,),) = db.session.query(
                    exists()
                    .where(CourseTopic.course_id == course.id)
                    .where(CourseTopic.topic_id == topic.id)
                )
                if not ret:
                    try:
                        course_topic = CourseTopic(
                            course_id=course.id, topic_id=topic.id
                        )
                        db.session.add(course_topic)
                        db.session.commit()
                    except IntegrityError:
                        db.session.rollback()

        for topic in Topic.query.all():
            for _ in range(randint(5, 10)):  # Each topic has 5-10 notes
                name = (
                    fake.first_name()[:50]  # Truncate the name to 50 characters
                    if fake.first_name() is not None
                    else "Default Name"
                )
                category = fake.catch_phrase()
                if category is None:
                    category = "default_category"
                note_creator = rc(
                    users
                )  # Randomly select a user to be the creator of the note
                note = Note(
                    name=fake.name()[:50],
                    title=fake.sentence()[:50],
                    content=fake.text(),
                    user_id=note_creator.id,  # Set the note creator to the randomly selected user
                    topic_id=topic.id,
                    category=fake.sentence()[:50],
                )
                db.session.add(note)
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
