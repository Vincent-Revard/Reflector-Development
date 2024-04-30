from itsdangerous import URLSafeTimedSerializer
from flask import render_template
from .. import (
    request,
    Resource,
    User,
    db,
    app,
    user_schema,
    create_access_token,
    make_response,
    set_access_cookies,
    create_refresh_token,
    set_refresh_cookies,
    redis_client,
    mail,
    Message,
    jwt_required,
)
import ipdb
import json


class Signup(Resource):
    model = User
    schema = user_schema

    def post(self):
        try:
            data = request.get_json()
            self.schema.context = {"is_signup": True}
            user = user_schema.load(data)
            existing_user = User.query.filter_by(email=user.email).first()
            if existing_user is not None:
                return {"message": "A user with this email already exists"}, 400
            existing_user_username = User.query.filter_by(
                username=user.username
            ).first()

            if existing_user_username is not None:
                return {"message": "A user with this username already exists"}, 400
            db.session.add(user)
            db.session.flush()

            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(identity=user.id)
            # csrf_token = generate_csrf_token()
            user_session = {
                "user_id": user.id,
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
            user_session_str = json.dumps(user_session)
            redis_client.set(
                access_token,
                user_session_str,
                ex=app.config["JWT_ACCESS_TOKEN_EXPIRES"],
            )
            redis_client.set(
                refresh_token,
                user_session_str,
                ex=app.config["JWT_REFRESH_TOKEN_EXPIRES"],
            )
            # redis_client.set(
            #     csrf_token,
            #     user_session_str,
            #     ex=app.config["JWT_CSRF_TOKEN_EXPIRES"],
            # )

            response = make_response(user_schema.dump(user), 201)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            # response.set_cookie("csrf_token", csrf_token)

            # Generate a unique token
            s = URLSafeTimedSerializer(app.config["SECRET_KEY"])
            token = s.dumps(user.email, salt="email-confirm")

            # Store the token in Redis
            redis_client.set(
                token,
                user.id,
            )

            verification_link = f"http://localhost:3000/verify/{token}"
            # Send an email with the token
            send_email(
                user.email,
                "Confirm Your Email",
                user.username,
                verification_link,
            )
            db.session.commit()

            return response
        except Exception as e:
            db.session.rollback()
            return {"message": str(e)}, 422


def send_email(to, subject, user_name, verification_link):
    html = render_template("verificationemail.html", user_name=user_name, verification_link=verification_link)
    msg = Message(
        subject,
        recipients=[to],
        html=html,
        sender=app.config["MAIL_DEFAULT_SENDER"],
    )
    mail.send(msg)
