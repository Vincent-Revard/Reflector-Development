from flask import request, jsonify
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from .. import Resource, User, db, app, redis_client
import ipdb

class Verify(Resource):
    def patch(self, token):
        # Extract the token from the request parameters
        # token = request.args.get("token")
        # Use the token to look up the user's ID in Redis
        user_id = redis_client.get(token)
        if user_id is None:
            return {"message": "The confirmation link is invalid or has expired."}, 400
        ipdb.set_trace()
        
        # Convert user_id to integer
        user_id = int(user_id)

        # Look up the user in the database
        user = User.query.get(user_id)
        if user is None:
            return {"message": "User not found"}, 404
        ipdb.set_trace()

        # Set the user's email_verified flag to True and save the changes
        user.email_verified = True
        db.session.commit()
        ipdb.set_trace()

        # Remove the token from Redis
        redis_client.delete(token)
        ipdb.set_trace()

        # Return a response
        return {"message": "Email verified successfully"}, 200
