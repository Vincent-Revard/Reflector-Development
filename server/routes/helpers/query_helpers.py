from config import db
from .. import select
from sqlalchemy.orm import joinedload

def execute_query(query):
    return db.session.execute(query).scalars()

def get_all(model):
    # return db.session.execute(select(model)).scalars().all()
    return execute_query(select(model)).all()

def get_instance_by_id(model, id):
    instance = db.session.get(model, id)
    print(instance)
    return instance

def get_one_by_condition(model, condition):
    return execute_query(select(model).where(condition)).first()

def get_all_by_condition(model, condition):
    return execute_query(select(model).where(condition)).all()


def get_related_data(
    user_id,
    user_model,
    user_course_model,
    course_model,
    course_topic_model,
    topic_model,
):
    return (
        db.session.query(user_model)
        .options(
            joinedload(user_model.user_courses.of_type(user_course_model))
            .joinedload(user_course_model.course.of_type(course_model))
            .joinedload(course_model.course_topics.of_type(course_topic_model))
            .joinedload(course_topic_model.topic.of_type(topic_model))
        )
        .filter(user_model.id == user_id)
        .first()
    )
