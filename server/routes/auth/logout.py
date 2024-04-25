# from flask_jwt_extended import unset_jwt_cookies
# from flask import make_response
# from flask_restful import Resource

from .. import (
    Resource,
    make_response,
    unset_jwt_cookies,
    unset_refresh_cookies,
    unset_access_cookies,
    get_jwt,
    redis_client,
    jwt_required,
)

class Logout(Resource):

    @jwt_required()
    def delete(self):
        try:
            access_token = get_jwt()["jti"]
            redis_client.delete(access_token)
            response = make_response({"message": "Logout successful"}, 200)
            unset_jwt_cookies(response)
            unset_refresh_cookies(response)
            unset_access_cookies(response)
            return response
        except Exception as e:
            return {"message": str(e)}, 422
