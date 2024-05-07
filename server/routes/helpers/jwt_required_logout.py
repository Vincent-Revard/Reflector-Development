from functools import wraps
from flask_jwt_extended.exceptions import NoAuthorizationError
from jwt.exceptions import ExpiredSignatureError
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity,
    get_jwt,
    get_jwt_header
)
from config import redis_client

import ipdb
from jwt import decode
from flask import current_app


def jwt_required_logout(**kwargs):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs_inner):
            # Check if JWT exists and is valid
            try:
                verify_jwt_in_request(**kwargs)
                jti = get_jwt()["jti"]

                entry = redis_client.get("blacklist:" + jti)
                if entry is not None:
                    return {"msg": "Token is revoked"}, 401
                return f(*args, **kwargs_inner)
            except NoAuthorizationError:
                return {"msg": "No authorization token provided"}, 401
            except ExpiredSignatureError:
                # If JWT is expired, manually decode it without verifying the expiration
                token = get_jwt_header()
                secret = current_app.config[
                    "JWT_SECRET_KEY"
                ]  # Get the secret key from the Flask app's configuration
                algorithm = current_app.config[
                    "JWT_ALGORITHM"
                ]  # Get the algorithm from the Flask app's configuration
                try:
                    decoded_token = decode(
                        token,
                        secret,
                        algorithms=[algorithm],
                        options={"verify_exp": False},
                    )
                    old_jwt_identity = decoded_token["identity"]
                    # Ensure old_jwt_identity is a string
                    if not isinstance(old_jwt_identity, str):
                        old_jwt_identity = str(old_jwt_identity)
                    # Proceed with the function
                    return f(*args, **kwargs_inner)
                except Exception as e:
                    return {"msg": str(e)}, 401

        return wrapper

    return decorator