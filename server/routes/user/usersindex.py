from .. import (
    request,
    UserUpdateSchema,
    User,
    g,
    BaseResource,
)

class UsersIndex(BaseResource):
    model = User
    schema = UserUpdateSchema()

    def get(self):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        return super().get(condition=(User.id == g.user.id))

    def delete(self):
        if g.user is None:
            return {"message": "Unauthorized"}, 401
        return super().delete(g.user.id)

    def patch(self, user_id=None):
        if g.user is None:
            return {"message": "Unauthorized"}, 401

        # Get the current password from the request data
        current_password = request.json.get("current_password")
        if not current_password:
            return {"message": "Current password is required"}, 400

        # Check if the current password matches the stored password
        if not g.user.authenticate(current_password):
            return {"message": "Current password is incorrect"}, 400

        # Hash the new password before storing it
        new_password = request.json.get("password_hash")
        if new_password:
            g.user.password_hash = new_password

        self.schema.context = {"is_update": True, "user_id": user_id}
        return super().patch(user_id)
