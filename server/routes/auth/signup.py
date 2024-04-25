from .. import (
    request,
    Resource,
    User,
    db,
    app,
    user_schema,
    create_access_token,
    make_response,
    set_access_cookies,
    create_refresh_token,
    set_refresh_cookies,
    redis_client,
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
            existing_user = User.query.filter_by(email=user.email).first()
            if existing_user is not None:
                return {"message": "A user with this email already exists"}, 400
            existing_user_username = User.query.filter_by(username=user.username).first()
            if existing_user_username is not None:
                return {"message": "A user with this username already exists"}, 400
            ipdb.set_trace()
            db.session.add(user)
            ipdb.set_trace()
            db.session.commit()
            ipdb.set_trace()

            access_token = create_access_token(identity=user.id, fresh=True)
            ipdb.set_trace()
            refresh_token = create_refresh_token(identity=user.id)
            ipdb.set_trace()
            redis_client.set(access_token, '', ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"])
            redis_client.set(refresh_token, '', ex=app.config["JWT_REFRESH_TOKEN_EXPIRES"])
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
