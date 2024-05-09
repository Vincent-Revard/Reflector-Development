from functools import wraps
from flask import jsonify
from flask_jwt_extended.exceptions import NoAuthorizationError
from jwt.exceptions import ExpiredSignatureError
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity,
    create_access_token,
    get_jwt,
    set_access_cookies,
)
import ipdb
from json import dumps

from .. import make_response

from config import app, redis_client


def jwt_required_modified(**kwargs):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs_inner):
            try:
                verify_jwt_in_request(**kwargs)
                return f(*args, **kwargs_inner)
            except NoAuthorizationError:
                return {"msg": "No authorization token provided"}, 401
            except ExpiredSignatureError:
                # If JWT is expired, get the identity of the expired JWT
                old_jwt_identity = get_jwt_identity()
                # Ensure old_jwt_identity is a string
                if not isinstance(old_jwt_identity, str):
                    old_jwt_identity = str(old_jwt_identity)
                # Create a new JWT
                new_access_token = create_access_token(identity=old_jwt_identity)
                # Add old JWT to blacklist
                redis_client.set("blacklist:" + old_jwt_identity, True)
                # Store the new access token in Redis
                user_session_str = dumps({"user_id": old_jwt_identity})
                redis_client.set(
                    new_access_token,
                    user_session_str,
                    ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"],
                )
                # Return new JWT to the user
                resp = make_response(
                    {"refresh": True, "new_access_token": new_access_token}, 200
                )
                set_access_cookies(resp, new_access_token)
                return resp

        return wrapper

    return decorator
