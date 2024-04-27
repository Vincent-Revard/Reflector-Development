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

    @jwt_required_modified
    def get(self, id):

        ipdb.set_trace()
        return super().get(id)

    @jwt_required_modified
    def delete(self):
        if g.profile is None:
            return {"message": "Unauthorized"}, 401
        return super().delete(g.profile.id)

    @jwt_required_modified
    def patch(self, user_id=None):
        if g.profile is None:
            return {"message": "Unauthorized"}, 401

        # Get the current password from the request data
        current_password = request.json.get("current_password")
        if not current_password:
            return {"message": "Current password is required"}, 400

        # Check if the current password matches the stored password
        if not g.profile.authenticate(current_password):
            return {"message": "Current password is incorrect"}, 400

        # Hash the new password before storing it
        new_password = request.json.get("password_hash")
        if new_password:
            g.profile.password_hash = new_password

        # Validate username and email
        username = request.json.get("username")
        email = request.json.get("email")

        existing_user_username = User.query.filter(User.username == username).first()
        existing_user_email = User.query.filter(User.email == email).first()

        if existing_user_username and existing_user_username.id != user_id:
            return {"message": "Username already exists"}, 400

        if existing_user_email and existing_user_email.id != user_id:
            return {"message": "Email already exists"}, 400

        self.schema.context = {"is_update": True, "user_id": user_id}
        return super().patch(user_id)
