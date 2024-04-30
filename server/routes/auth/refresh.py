from .. import (
    Resource,
    db,
    User,
    request,
    user_schema,
    jwt_required,
    current_user,
    create_access_token,
    make_response,
    set_access_cookies,
    redis_client,
    app,
    create_refresh_token,
    set_refresh_cookies,
)
from json import loads, dumps
import ipdb

class Refresh(Resource):

    @jwt_required(refresh=True)
    def post(self):
        csrf_refresh_token = request.cookies.get("csrf_refresh_token")
        refresh_token = request.cookies.get("refresh_token_cookie")

        user_session = redis_client.get(refresh_token)

        if user_session is not None:
            user_session = loads(user_session)
        if not user_session or user_session["csrf_token"] != csrf_refresh_token:
            return {"message": "Invalid CSRF token"}, 401
        new_access_token = create_access_token(
            identity=user_session["user_id"], fresh=False
        )
        new_refresh_token = create_refresh_token(identity=user_session["user_id"])
        user_session["access_token"] = new_access_token
        user_session["refresh_token"] = new_refresh_token
        user_session_str = dumps(user_session)
        redis_client.delete(refresh_token)
        redis_client.set(
            new_refresh_token,
            user_session_str,
            ex=app.config["JWT_REFRESH_TOKEN_EXPIRES"],
        )
        redis_client.set(
            new_access_token,
            user_session_str,
            ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"],
        )

        response = make_response(user_schema.dump(current_user), 200)
        set_access_cookies(response, new_access_token)
        set_refresh_cookies(response, new_refresh_token)
        return response
