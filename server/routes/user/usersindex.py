from .. import (
    request,
    UserUpdateSchema,
    User,
    g,
    BaseResource,
    jwt_required,
    current_user,
)
import ipdb


class UsersIndex(BaseResource):
    model = User
    schema = UserUpdateSchema()

    @jwt_required()
    def get(self, id=None):

        if g.profiles is None:
            return {"message": "Unauthorized"}, 401
        if id is None:
            id = current_user.id
        return super().get(id)

    @jwt_required()
    def delete(self, id):
        if g.profiles is None:
            return {"message": "Unauthorized"}, 401
        return super().delete(g.profiles.id)

    @jwt_required()
    def patch(self, id, csrfToken=None):
        # id = request.view_args["id"]
        if g.profiles is None:
            return {"message": "Unauthorized"}, 401

        # Get the current password from the request data

        current_password = request.json.get("current_password")

        if not current_password:
            return {"message": "Current password is required"}, 400

        # Check if the current password matches the stored password
        if not g.profiles.authenticate(current_password):
            return {"message": "Current password is incorrect"}, 400

        # Hash the new password before storing it
        new_password = request.json.get("password")
        if new_password:
            g.profiles.password = new_password

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
