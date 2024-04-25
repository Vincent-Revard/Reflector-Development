# from flask_jwt_extended import unset_jwt_cookies
# from flask import make_response
# from flask_restful import Resource

from .. import (
    Resource,
    make_response,
    unset_jwt_cookies,
    get_jwt,
    redis_client,
    jwt_required,
    request,
    ipdb,
    jwt_required_modified,

)

class Logout(Resource):

    @jwt_required_modified
    def delete(self):
        try:
            csrf_token = request.cookies.get("csrf_access_token")
            refresh_token = request.cookies.get("csrf_refresh_token")
            access_token = get_jwt()["jti"]
            ipdb.set_trace()
            user_session = redis_client.get(refresh_token)
            # if not user_session or user_session["csrf_token"] != csrf_token:
            #     return {"message": "Invalid CSRF token"}, 401
            response = make_response({"message": "Logout successful"}, 200)
            unset_jwt_cookies(response)
            redis_client.delete(access_token)
            redis_client.delete(refresh_token)
            return response
        except Exception as e:
            return {"message": str(e)}, 422
