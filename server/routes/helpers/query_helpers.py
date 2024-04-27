
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
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().first()
    return execute_query(select(model).where(condition)).first()


def get_all_by_condition(model, condition):
    # stmt = select(model).where(condition)
    # result = db.session.execute(stmt)
    # return result.scalars().all()
    return execute_query(select(model).where(condition)).all()


# ? before request - verify session login
# @app.before_request
# def load_logged_in_user():
#     user_id = session.get("user_id")
#     if user_id is None:
#         g.user = None
#     else:
#         g.user = get_instance_by_id(User, user_id)
#     #! Refactor this, remove recipebyid + consider additional adds
