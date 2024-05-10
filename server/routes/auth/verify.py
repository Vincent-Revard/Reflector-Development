from flask import request, jsonify
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from .. import Resource, User, db, app, redis_client, jwt_required, current_user
import ipdb


class Verify(Resource):

    def patch(self, token=None):
        # Check if the token is provided
        if token is None:
            return {"message": "No token provided."}, 400

        # Use the token to look up the user's ID in Redis

        user_id = redis_client.get(token)
        if user_id is None:
            return {"message": "The confirmation link is invalid or has expired."}, 400

        # Convert user_id to integer
        user_id = int(user_id)

        # Look up the user in the database
        user = User.query.get(user_id)
        if user is None:
            return {"message": "User not found"}, 404

        # Set the user's email_verified flag to True and save the changes
        user.email_verified = True
        db.session.commit()

        # Remove the token from Redis
        redis_client.delete(token)

        # Return a response
        return {"message": "Email verified successfully"}, 200
