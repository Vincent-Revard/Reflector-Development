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
    jwt_required_modified
)
from json import loads, dumps
import ipdb


class Refresh(Resource):

    @jwt_required_modified(refresh=True)
    def post(self):
        refresh_token = request.cookies.get("refresh_token_cookie")

        user_session = redis_client.get(refresh_token)
        if user_session is None:
            return {"msg": "Invalid refresh token"}, 401

        # Check if user_session has "user_id" key
        if "user_id" not in user_session:
            return {"msg": "Invalid user session"}, 401

        new_access_token = create_access_token(
            identity=user_session["user_id"], fresh=False
        )
        new_refresh_token = create_refresh_token(identity=user_session["user_id"])

        # Store the new refresh token in Redis
        redis_client.set(
            new_refresh_token, user_session, ex=app.config["JWT_REFRESH_TOKEN_EXPIRES"]
        )

        # Store the new access token in Redis
        redis_client.set(
            new_access_token, user_session, ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"]
        )

        response = make_response(user_schema.dump(current_user), 200)
        set_access_cookies(response, new_access_token)
        set_refresh_cookies(
            response, new_refresh_token
        )
        return response