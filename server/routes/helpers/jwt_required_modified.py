from functools import wraps
from flask import jsonify
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity,
    create_access_token,
)

def jwt_required_modified(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        from config import redis_client
        # Check if JWT exists and is valid
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except NoAuthorizationError:
            # If JWT is expired, get the identity of the expired JWT
            old_jwt_identity = get_jwt_identity()

            # Ensure old_jwt_identity is a string
            if not isinstance(old_jwt_identity, str):
                old_jwt_identity = str(old_jwt_identity)

            # Create a new JWT
            new_access_token = create_access_token(identity=old_jwt_identity)

            # Add old JWT to blacklist
            redis_client.set("blacklist:" + old_jwt_identity, True)

            # Return new JWT to the user
            resp = jsonify({"refresh": True, "new_access_token": new_access_token})
            return resp, 401

    return decorator
