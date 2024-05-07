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
    jwt_required_logout,
    jwt_redis_blocklist,
    app
)

class Logout(Resource):

    @jwt_required_logout()
    def delete(self):
        try:
            jti = get_jwt()["jti"]
            response = make_response({"message": "Logout successful"}, 200)
            unset_jwt_cookies(response)
            jwt_redis_blocklist.set(
                "blacklist:" + jti, "blocked", ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"]
            )
            return response
        except Exception as e:
            return {"message": str(e)}, 422
