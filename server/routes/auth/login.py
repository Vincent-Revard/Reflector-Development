from .. import (
    request,
    Resource,
    User,
    user_schema,
    create_access_token,
    make_response,
    set_access_cookies,
    create_refresh_token,
    set_refresh_cookies,
)
import ipdb

class Login(Resource):
    model = User
    schema = user_schema

    def post(self):
        try:
            self.schema.context = {"is_signup": False}
            request_data = request.get_json()
            ipdb.set_trace()
            data = self.schema.load(request_data)
            ipdb.set_trace()
            username = data.username
            password = request_data.get("password")
            ipdb.set_trace()

            user = User.query.filter_by(username=username).first()
            if user is None or not user.authenticate(password):
                return {"message": "Invalid credentials"}, 401
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(identity=user.id)
            response = make_response(self.schema.dump(user), 200)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        except Exception as e:
            return {"message": str(e)}, 422
