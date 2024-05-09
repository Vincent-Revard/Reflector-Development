from .. import (
    request,
    UserUpdateSchema,
    User,
    g,
    BaseResource,
    jwt_required_modified,
    jwt_required
)
import ipdb

class UsersIndex(BaseResource):
    model = User
    schema = UserUpdateSchema()

    @jwt_required()
    def get(self, id):
        # ipdb.set_trace()
        if g.profile is None:
            return {"message": "Unauthorized"}, 401

        return super().get(id)

    @jwt_required()
    def delete(self, id):
        if g.profile is None:
            return {"message": "Unauthorized"}, 401
        return super().delete(g.profile.id)

    @jwt_required()
    def patch(self, id, csrfToken=None):
        # id = request.view_args["id"]
        if g.profile is None:
            return {"message": "Unauthorized"}, 401

        # Get the current password from the request data
        # ipdb.set_trace()
        current_password = request.json.get("current_password")
        # ipdb.set_trace()
        if not current_password:
            return {"message": "Current password is required"}, 400
        # ipdb.set_trace()

        # Check if the current password matches the stored password
        if not g.profile.authenticate(current_password):
            return {"message": "Current password is incorrect"}, 400
        # ipdb.set_trace()

        # Hash the new password before storing it
        new_password = request.json.get("password")
        if new_password:
            g.profile.password = new_password
        # ipdb.set_trace()

        # Validate username and email
        username = request.json.get("username")
        email = request.json.get("email")

        existing_user_username = User.query.filter(User.username == username).first()
        existing_user_email = User.query.filter(User.email == email).first()

        if existing_user_username and existing_user_username.id != id:
            return {"message": "Username already exists"}, 400

        if existing_user_email and existing_user_email.id != id:
            return {"message": "Email already exists"}, 400

        self.schema.context = {"is_update": True, "user_id": id}
        return super().patch(id)
