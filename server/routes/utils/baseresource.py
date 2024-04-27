from .. import Resource, request, IntegrityError, ValidationError

from config import db

class BaseResource(Resource):
    model = None
    schema = None

    def get(self, id=None, condition=None):
        try:
            if id is None and condition is None:
                instances = self.model.query.all()
                return self.schema.dump(instances, many=True), 200
            elif condition is not None:
                instances = self.model.query.filter_by(**condition).all()
                return self.schema.dump(instances, many=True), 200
            else:
                instance = self.model.query.get(id)
                if instance is None:
                    return {"errors": f"{self.model.__name__} not found"}, 404
                return self.schema.dump(instance), 200
        except Exception as e:
            db.session.rollback()
            return {"errors": str(e)}, 400

    def delete(self, id=None):
        try:
            instance = self.model.query.get(id)
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

    def patch(self, id=None):
        try:
            data = self.schema.load(request.json)
            instance = self.model.query.get(id)
            for key, value in data.items():
                setattr(instance, key, value)
            db.session.commit()
            return self.schema.dump(instance), 200
        except ValidationError as e:
            return {"message": str(e)}, 422
        except IntegrityError:
            db.session.rollback()
            return {"message": "Invalid data"}, 422
