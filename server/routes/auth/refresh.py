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
import json


class Refresh(Resource):

    @jwt_required(refresh=True)
    def post(self):
        refresh_token = request.cookies.get("refresh_token_cookie")

        user_session = redis_client.get(refresh_token)
        if user_session is None:
            return {"msg": "Invalid refresh token"}, 401

        # Parse the user session data from a JSON string to a dictionary
        user_session_dict = json.loads(user_session)

        # Check if user_session has "user_id" key
        if "user_id" not in user_session_dict:
            return {"msg": "Invalid user session"}, 401

        new_access_token = create_access_token(
            identity=user_session_dict["user_id"], fresh=False
        )

        redis_client.set(
            new_access_token, user_session, ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"]
        )

        response = make_response(user_schema.dump(current_user), 200)
        set_access_cookies(response, new_access_token)

        return response
