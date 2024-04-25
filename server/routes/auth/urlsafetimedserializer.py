from itsdangerous import URLSafeTimedSerializer
from models.user import User
from config import db, redis_client
from .signup import send_email


# Generate a unique token
s = URLSafeTimedSerializer(app.config["SECRET_KEY"])
token = s.dumps(user.email, salt="email-confirm")

# Store the token in Redis
redis_client.set(user.id, token)

# Send an email with the token
send_email(user.email, "Confirm Your Email", "email/confirm", token=token)


# When the user clicks the link, validate the token and mark the user as verified
@app.route("/confirm/<token>")
def confirm_email(token):
    try:
        email = s.loads(token, salt="email-confirm", max_age=3600)
    except:
        return "The confirmation link is invalid or has expired."

    user = User.query.filter_by(email=email).first_or_404()

    if user.verified:
        return "Account already confirmed. Please login.", 200
    else:
        user.verified = True
        db.session.add(user)
        db.session.commit()
        return "You have confirmed your account. Thanks!", 200
