from .. import (
    request,
    Resource,
    User,
    db,
    user_schema,
    create_access_token,
    make_response,
    set_access_cookies,
    create_refresh_token,
    set_refresh_cookies,
)
import ipdb

class Signup(Resource):
    model = User
    schema = user_schema

    def post(self):
        try:
            data = request.get_json()
            ipdb.set_trace()
            self.schema.context = {"is_signup": True}
            user = user_schema.load(data)
            ipdb.set_trace()
            db.session.add(user)
            ipdb.set_trace()
            db.session.commit()
            ipdb.set_trace()

            access_token = create_access_token(identity=user.id, fresh=True)
            ipdb.set_trace()
            refresh_token = create_refresh_token(identity=user.id)
            ipdb.set_trace()

            response = make_response(user_schema.dump(user), 201)
            ipdb.set_trace()
            set_access_cookies(response, access_token)
            ipdb.set_trace()
            set_refresh_cookies(response, refresh_token)
            ipdb.set_trace()
            return response
        except Exception as e:
            db.session.rollback()
            return {"message": str(e)}, 422
