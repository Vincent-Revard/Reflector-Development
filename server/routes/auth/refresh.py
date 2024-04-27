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


class Refresh(Resource):

    @jwt_required(refresh=True)
    def post(self):
        csrf_token = request.cookies.get("csrf_token")
        refresh_token = request.cookies.get("refresh_token")
        user_session = redis_client.get(refresh_token)
        if user_session is not None:
            user_session = loads(user_session)
        if not user_session or user_session["csrf_token"] != csrf_token:
            return {"message": "Invalid CSRF token"}, 401
        new_access_token = create_access_token(
            identity=user_session["user_id"], fresh=False
        )
        user_session["access_token"] = new_access_token
        redis_client.set(
            refresh_token,
            dumps(user_session),
            ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"],
        )
        response = make_response(user_schema.dump(current_user), 200)
        set_access_cookies(response, new_access_token)
        return response
