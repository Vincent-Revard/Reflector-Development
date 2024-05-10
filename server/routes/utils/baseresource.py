from .. import Resource, request, IntegrityError, ValidationError
from ..helpers.query_helpers import (
    get_all,
    get_all_by_condition,
    get_instance_by_id,
    get_one_by_condition,
)
from sqlalchemy import and_
from flask_jwt_extended import jwt_required

from models.user import User

from config import db
import ipdb


class BaseResource(Resource):
    model = None
    schema = None

    def get(self, id=None, condition=None):

        try:
            if id is None and condition is None:
                instances = get_all(self.model)

                return (
                    self.schema.dump(instances, many=True),
                    200,
                )  # Use the schema to serialize the instances
            elif condition is not None:
                instances = get_all_by_condition(self.model, condition)

                return (
                    self.schema.dump(instances, many=True),
                    200,
                )  # Use the schema to serialize the instances
            else:
                instance = get_instance_by_id(self.model, id)
                if instance is None:
                    return {"errors": f"{self.model.__name__} not found"}, 404

                return (
                    self.schema.dump(instance),
                    200,
                )  # Use the schema to serialize the instance
        except Exception as e:
            db.session.rollback()
            return {"errors": str(e)}, 400

    @jwt_required()
    def delete(self, id=None):
        try:
            instance = get_instance_by_id(self.model, id)
            if instance is None:
                return {"errors": f"{self.model.__name__} not found"}, 404

            db.session.delete(instance)
            db.session.commit()
            return "", 204
        except Exception as e:
            db.session.rollback()
            return {"errors": str(e)}, 400

    def post(self):
        try:
            data = self.schema.load(request.json)
            instance = self.model(**data)
            db.session.add(instance)
            db.session.commit()
            return self.schema.dump(instance), 201
        except ValidationError as e:
            db.session.rollback()
            return {"message": str(e)}, 422
        except IntegrityError:
            db.session.rollback()
            return {"message": "Invalid data"}, 422

    def patch(self, id):
        # try:
        #

        #     data = self.schema.load(request.json)
        #     # Check if data is a User instance (object not dictionary)
        #     if isinstance(data, User):
        #

        #         # Convert the User instance to a dictionary
        #         data = {c.name: getattr(data, c.name) for c in data.__table__.columns}
        #     else:
        #         # Convert data to a dictionary if it's not already one
        #         data = {c.name: getattr(data, c.name) for c in data.__table__.columns}
        #
        #     instance = get_instance_by_id(self.model, id)
        #     if instance is None:
        #         return {"errors": f"{self.model.__name__} not found"}, 404
        #

        #     for key, value in data.items():
        #         if value is not None:
        #             setattr(instance, key, value)
        #     db.session.commit()
        #
        #     return {self.model.__name__.lower(): self.schema.dump(instance)}, 200
        # except ValidationError as e:
        #     return {"message": str(e)}, 422
        # except IntegrityError:
        #     db.session.rollback()
        #     return {"message": "Invalid data"}, 422
        try:
            data = self.schema.load(request.json)
            if isinstance(data, User):
                # Convert the User instance to a dictionary
                data = {c.name: getattr(data, c.name) for c in data.__table__.columns}

            instance = get_instance_by_id(self.model, id)
            if instance is None:
                return {"errors": f"{self.model.__name__} not found"}, 404

            for key, value in data.items():
                if value is not None:
                    setattr(instance, key, value)
            db.session.commit()
            return {self.model.__name__.lower(): self.schema.dump(instance)}, 200
        except ValidationError as e:
            return {"message": str(e)}, 422
        except IntegrityError:
            db.session.rollback()
            return {"message": "Invalid data"}, 422
