# Standard library imports

# Remote library imports

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
from flask_marshmallow import Marshmallow
from flask_restful import Api

from flask_bcrypt import Bcrypt
from os import environ

# from flask_cors import CORS
# from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes

app = Flask(__name__)
# app.secret_key = b"Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SQLALCHEMY_ECHO"] = True
app.secret_key = environ.get("SESSION_SECRET")
app.config["SESSION_TYPE"] = "sqlalchemy"
app.config["SESSION_SQLALCHEMY_TABLE"] = "sessions"


# app.json.compact = False #! ??? needed ???

# Define metadata, instantiate db
# metadata = MetaData(naming_convention={
#     "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
# })
db = SQLAlchemy(app)
app.config["SESSION_SQLALCHEMY"] = db
migrate = Migrate(app, db)
# db.init_app(app)
# Instantiate REST API
api = Api(app, prefix="/api/v1")
ma = Marshmallow(app)
session = Session(app)
flask_bcrypt = Bcrypt(app)

# Instantiate CORS
# CORS(app)
