App Description:
Reflector is a platform designed to streamline your study experience by centralizing all your course-related materials and allowing you to break your courses into various topics with subjects or titles that can be utilized as tags to more accurately reflect the type of relationship each note has with a topic/course. 

Key features include:

Organize Effortlessly: Categorize courses and tag topics for easy retrieval.
Collaborative Learning (Coming Soon): Collaborate with peers and tackle group projects seamlessly.
Voice-to-Text Input (Coming Soon): Input notes effortlessly using voice-to-text.
Interactive Quizzes (Coming Soon): Convert notes into engaging quizzes tailored to your course content.

---

## Getting Started

## Back-end:
Navigate to the server directory: cd server/
Install dependencies: pipenv install
Activate virtual environment: pipenv shell
Start the server: python app.py

## Required Dependencies (via Pipenv)

[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
ipdb = "0.13.9"
flask = "*"
flask-sqlalchemy = "*"
Werkzeug = "2.2.2"
flask-migrate = "*"
sqlalchemy-serializer = "*"
flask-restful = "*"
flask-cors = "*"
faker = "*"
sqlalchemy = "*"
flask-bcrypt = "*"
flask-marshmallow = "*"
flask-session = "*"
python-dotenv = "*"
marshmallow-sqlalchemy = "*"
email-validator = "*"
flask-jwt-extended = "*"
flask-redis = "*"
flask-mail = "*"
redis = "*"

[requires]
python_full_version = "3.8.13"

You will also need to create a .env file that will hold various app-specific data that your config file will utilize through environ.get from within the server/config.py file. The .env file should be located at the main file directory and not within the server or client folders. 

## environment variables (in .env)
PIPENV_IGNORE_VIRTUALENVS=1
FLASK_APP=app.py
FLASK_RUN_PORT=5555
FLASK_DEBUG=1
JWT_SECRET='THE_JWT_SECRET_KEY'
SMTP_PASS='SMTP_PASSWORD_FOR_EMAIL_AUTH_CONFIRMATION'
SECRET_KEY='SECRET_KEY_FOR_FLASK'
REDIS_URL='REDIS_LOCAL_SERVER_URL'
MAIL_USERNAME='MAIL_USERNAME_TO_SEND_EMAIL_CONFIRMATION_REQUESTS_FROM'
MAIL_DEFAULT_SENDER='DEFAULT_MAIL_USERNAME_TO_SEND_EMAIL_CONFIRMATION_REQUESTS_FROM'
SQLALCHEMY_DATABASE_URI='SQLALCHEMY_DATABASE_URL'


## Front-end 
Navigate to the client directory: cd client
Install dependencies: npm install
Start the React app: npm start

# Required Dependencies (in package.json)
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:5555",
  "dependencies": {
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "@mui/icons-material": "^5.15.15",
    "@mui/material": "^5.15.15",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^11.2.7",
    "@testing-library/user-event": "^13.5.0",
    "formik": "^2.4.5",
    "react": "^18.3.1",
    "react-burger-menu": "^3.0.9",
    "react-dom": "^18.3.1",
    "react-icons": "^5.1.0",
    "react-modal": "^3.16.1",
    "react-router-dom": "^6.23.0",
    "react-scripts": "5.0.1",
    "styled-components": "^6.1.8",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

# You will need to create a database using Flask SQLALchemy by completeing the following steps:

cd into the server directory : cd server/
running the following commands in the terminal to initiate the database instance and migration using Alembic. 
flask db init
flask db migration -m "Initial Migration"
flask db upgrade head

# Additionally, there is a seed file that holds from fake data to utilize if desired. 
To run this seed file and integrate it within your new database run the following commands while still in the server directory:
python seed.py 


You will see a notification once the seed completes and if it was successful or not and if not, for what reason. 

# Important information to note:

Routes are rendered and fetched based on RESTful API standards to confirm validity of information upon each requested endpoint through React Router Dom v6.4 (server/routes and client/routes/routes.js respectively). 

There is a main AuthProvider which provides the context for the user currently logged in. Flask JWT with Redis storage is utilized to handle token management for both session and email verification along with blacklisting expired access tokens and refresh tokens. This Context will be used to confirm is a valid user is logged in during requests to the API and is utilized under client/context/context_list.js to conditionally render routes based on loading status

These renders will work through cominbation of the context_list component and the fetching logic that works through ContextProvider (useEffect) and will fetch the appropriate end-point based data and send this stateful data as context to ContextList who then conditionally renders each route given the URL and when it is accessed. 

The card components are utilized as the "detail level" for each route (courses/ , topics/ and /notes) and the index_cards will display the "limited level" of data view for the component to be used in a collapsible menu by its parent. 

Each component has a related form component for both POST and PATCH that is utilized based on URL/path called when mounting the related form component. 

# License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) - see the MIT License link for details.