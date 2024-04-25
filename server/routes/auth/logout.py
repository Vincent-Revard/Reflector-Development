# from flask_jwt_extended import unset_jwt_cookies
# from flask import make_response
# from flask_restful import Resource

from .. import (
    Resource,
    make_response,
    unset_jwt_cookies,
)

class Logout(Resource):
    def delete(self):
        try:
            response = make_response({"message": "Logout successful"}, 200)
            unset_jwt_cookies(response)
            return response
        except Exception as e:
            return {"message": str(e)}, 422
