
from config import db
from .. import select

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

