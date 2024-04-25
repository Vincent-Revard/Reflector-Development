# Standard library imports

# Remote library imports

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from flask_session import Session
from flask_marshmallow import Marshmallow
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from os import environ
from datetime import timedelta

# from flask_cors import CORS
# from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes

app = Flask(__name__)
# app.secret_key = b"Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SQLALCHEMY_ECHO"] = True

#! Flask_Session setup below!
# app.secret_key = environ.get("SESSION_SECRET")
# app.config["SESSION_TYPE"] = "sqlalchemy"
# app.config["SESSION_SQLALCHEMY_TABLE"] = "sessions"
# app.config["SESSION_SQLALCHEMY"] = db

# ? setup JWT extended
app.config["JWT_SECRET_KEY"] = environ.get("JWT_SECRET")
# Here you can globally configure all the ways you want to allow JWTs to
# be sent to your web application. By default, this will be only headers.
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
# If true this will only allow the cookies that contain your JWTs to be sent
# over https. In production, this should always be set to True
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_CSRF_IN_COOKIES"] = True
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=2)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(minutes=30)

#! Extensions Setup
# flask-sqlalchemy connection to app
db = SQLAlchemy(app)
# flask-migrate connection to app
migrate = Migrate(app, db)
# Instantiate REST API
api = Api(app, prefix="/api/v1")
# flask-marshmallow connection to app
ma = Marshmallow(app)
# ? flask-session
# session = Session(app)
# session.app.session_interface.db.create_all()
flask_bcrypt = Bcrypt(app)
#! Flask JWT Extended configuration
jwt = JWTManager(app)

# Instantiate CORS if not using proxy
# CORS(app)