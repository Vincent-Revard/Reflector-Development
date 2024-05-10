#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from sqlalchemy.sql import text
import redis
from sqlalchemy import exists
from sqlalchemy.exc import IntegrityError
from flask_redis import FlaskRedis


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
        redis_store = FlaskRedis(app)
        # r = redis.Redis(host='localhost', port=6379, db=0)  # Connect to your Redis instance
        # r.flushall()  # Clear all data in Redis
        # Use the Redis connection
        redis_store.flushall()  # Clear all data in Redis

        # Define the original courses and topics
        course_names = ["Computer Science", "Biology", "Physics", "Mathematics"]
        course_topics = {
            "Computer Science": ["Algorithms", "Machine Learning", "Computer Networks"],
            "Biology": ["Ecology", "Biochemistry", "Anatomy"],
            "Physics": ["Thermodynamics"],
            "Mathematics": ["Statistics"],
        }


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
                topic = Topic(
                    name=fake.catch_phrase(), creator_id=course.creator_id
                )  # Updated this line
                db.session.add(topic)
                db.session.commit()
                course_topic = CourseTopic(course_id=course.id, topic_id=topic.id)
                db.session.add(course_topic)
                db.session.commit()

                # Create a note for the topic
                note_creator = rc(users)  # Randomly select a user to be the creator of the note
                note = Note(
                    name=fake.first_name(),
                    title=fake.sentence(),
                    content=fake.paragraph(),
                    user_id=note_creator.id,  # Set the note creator to the randomly selected user
                    topic_id=topic.id,
                    category=fake.catch_phrase(),
                )
                db.session.add(note)
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
                ((ret,),) = db.session.query(
                    exists()
                    .where(CourseTopic.course_id == course.id)
                    .where(CourseTopic.topic_id == topic.id)
                )
                if not ret:
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
                note_creator = rc(users)  # Randomly select a user to be the creator of the note
                note = Note(
                    name=name,
                    title=fake.sentence(),
                    content=fake.paragraph(),
                    user_id=note_creator.id,  # Set the note creator to the randomly selected user
                    topic_id=topic.id,
                    category=category,
                )
                db.session.add(note)
            db.session.commit()

        def generate_note_content(topic_name):
            if topic_name == "Statistics":
                return """
                    Statistics is a branch of mathematics that deals with the collection, analysis, interpretation, and presentation of data.
                    It is used in various fields such as economics, biology, sociology, and business to make informed decisions based on data.
                    Key topics in statistics include probability, hypothesis testing, regression analysis, and sampling techniques.
                """
            elif topic_name == "Biochemistry":
                return """
                    Biochemistry is the study of the chemical processes and substances that occur within living organisms.
                    It combines principles of biology and chemistry to understand the molecular mechanisms underlying biological processes.
                    Important topics in biochemistry include metabolism, enzyme kinetics, molecular biology, and protein structure.
                """
            # Add more elif blocks for other topics
            elif topic_name == "Ecology":
                return """
                    Ecology is the scientific study of the interactions between organisms and their environments.
                    It explores how living organisms interact with each other and with their physical surroundings.
                    Key concepts in ecology include ecosystems, biodiversity, food webs, and ecological succession.
                """
            elif topic_name == "Algorithms":
                return """
                    Algorithms are step-by-step procedures or instructions for solving problems.
                    They are used in computer science to perform computations, data processing, and automated reasoning tasks.
                    Important topics in algorithms include sorting algorithms, searching algorithms, and graph algorithms.
                """
            # Add more elif blocks for other topics
            elif topic_name == "Organic Chemistry":
                return """
                    Organic chemistry is the study of the structure, properties, composition, reactions, and synthesis of organic compounds.
                    It focuses on carbon-containing compounds, including hydrocarbons and their derivatives.
                    Key topics in organic chemistry include functional groups, stereochemistry, and reaction mechanisms.
                """
            elif topic_name == "Machine Learning":
                return """
                    Machine learning is a subset of artificial intelligence that focuses on the development of algorithms that allow computers to learn from and make predictions or decisions based on data.
                    It is used in various applications such as image recognition, natural language processing, and autonomous vehicles.
                    Important topics in machine learning include supervised learning, unsupervised learning, and reinforcement learning.
                """
            # Add more elif blocks for other topics
            elif topic_name == "Anatomy":
                return """
                    Anatomy is the branch of biology that studies the structure and organization of living organisms.
                    It involves the examination of the physical structures of organisms and their relationships to each other.
                    Key topics in anatomy include the skeletal system, muscular system, circulatory system, and nervous system.
                """
            elif topic_name == "Computer Networks":
                return """
                    Computer networks are systems of interconnected computers and devices that communicate with each other.
                    They allow for the sharing of resources and information between users and devices.
                    Important topics in computer networks include network protocols, transmission media, network architecture, and security.
                """
            # Add more elif blocks for other topics
            elif topic_name == "Thermodynamics":
                return """
                    Thermodynamics is the branch of physics that deals with the relationships between heat, work, and energy.
                    It explores how energy is transferred and transformed in physical systems.
                    Key topics in thermodynamics include laws of thermodynamics, heat engines, and entropy.
                """
            elif topic_name == "Physical Chemistry":
                return """
                    Physical chemistry is the branch of chemistry that deals with the study of the physical properties and behavior of matter.
                    It combines principles of physics and chemistry to understand the atomic and molecular interactions in chemical systems.
                    Important topics in physical chemistry include chemical kinetics, thermodynamics, and quantum chemistry.
                """
            # Add more elif blocks for other topics
            else:
                return "Default note content"

        def generate_note_details(course_name, topic_name):
            # Generate category, name, and title based on the context of the note's topic and course
            category = f"{course_name} - {topic_name}"  # Example: "Computer Science - Algorithms"
            name = f"{course_name} Student"  # Example: "Computer Science Student"
            title = f"Introduction to {topic_name}"  # Example: "Introduction to Algorithms"
            return category, name, title

        # Generate 50 unique notes
# Generate 50 unique notes
        generated_notes = set()  # To ensure uniqueness
        users = User.query.all()
        for _ in range(5):
            course_name = rc(course_names)
            topic_name = rc(course_topics[course_name])
            note_content = generate_note_content(topic_name)
            category, name, title = generate_note_details(course_name, topic_name)

            # Select a random user and topic
# Select a random user and topic
        user = rc(users)
        topic = Topic.query.filter_by(name=topic_name).first()

        # If the topic does not exist, create it
        if topic is None:
            topic = Topic(name=topic_name, creator_id=user.id)
            db.session.add(topic)
            db.session.commit()

        # Create a unique note tuple
        note_tuple = (course_name, topic_name, note_content, user.id, topic.id)
        while note_tuple in generated_notes:
            course_name = rc(course_names)
            topic_name = rc(course_topics[course_name])
            note_content = generate_note_content(topic_name)
            category, name, title = generate_note_details(course_name, topic_name)
            user = rc(users)
            topic = Topic.query.filter_by(name=topic_name).first()

            # If the topic does not exist, create it
            if topic is None:
                topic = Topic(name=topic_name, creator_id=user.id)
                db.session.add(topic)
                db.session.commit()

            note_tuple = (course_name, topic_name, note_content, user.id, topic.id)

            # Add the note tuple to the set of generated notes
            generated_notes.add(note_tuple)

            # Create the note using the generated details
            note = Note(
                name=name,
                title=title,
                content=note_content,
                category=category,
                user_id=user.id,
                topic_id=topic.id,
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
                    course = rc(Course.query.all())  # Randomly select a course
                    user_topic = UserTopic(user_id=user.id, topic_id=topic.id, course_id=course.id)
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
