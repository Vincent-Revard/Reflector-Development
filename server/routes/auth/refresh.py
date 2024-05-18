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
)
from json import loads, dumps
import ipdb
import json


class Refresh(Resource):

    @jwt_required(refresh=True, optional=True)
    def post(self):
        refresh_token = request.cookies.get("refresh_token_cookie")

        # Check if refresh_token is None
        if refresh_token is None:
            return {"msg": "Refresh cookie missing: Please log back in"}, 400

        user_session = redis_client.get(refresh_token)
        if user_session is None:
            # Add the refresh token to the blacklist
            redis_client.set(
                "blacklist:" + refresh_token,
                "blocked",
                ex=app.config["JWT_REFRESH_TOKEN_EXPIRES"],
            )
            return {"msg": "Your session has expired. Please log back in"}, 401

        # Parse the user session data from a JSON string to a dictionary
        user_session_dict = json.loads(user_session)

        # Check if user_session has "user_id" key
        if "user_id" not in user_session_dict:
            return {"msg": "Invalid user session. Please log back in"}, 401

        # Get the old access token and add it to the blacklist
        old_access_token = user_session_dict.get("access_token")
        if old_access_token:
            redis_client.set(
                "blacklist:" + old_access_token,
                "blocked",
                ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"],
            )

        new_access_token = create_access_token(
            identity=user_session_dict["user_id"], fresh=False
        )

        # Update the user session with the new access_token
        user_session_dict["access_token"] = new_access_token
        user_session_str = json.dumps(user_session_dict)

        # Set the new access token in Redis
        redis_client.set(
            new_access_token,
            user_session_str,
            ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"],
        )

        # Update the user session stored with the refresh token as the key
        redis_client.set(
            refresh_token, user_session_str, ex=app.config["JWT_REFRESH_TOKEN_EXPIRES"]
        )

        response = make_response(user_schema.dump(current_user), 200)
        set_access_cookies(response, new_access_token)

        return response
