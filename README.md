Fantasy Cycling App
Welcome to the Fantasy Cycling App, a web application that allows users to create and manage fantasy cycling teams, track rider performances, and compete in custom leagues. The app consists of a Flask backend and a React frontend.

Table of Contents
Project Overview
Features
Technologies Used
Setup and Installation
Running the App
Folder Structure
API Endpoints
Future Improvements
Project Overview
The Fantasy Cycling App allows users to:

Register and log in with authentication managed by JWT.
Create fantasy cycling teams.
Draft and manage riders for their teams.
Compete in different fantasy leagues.
View rider rankings and stage results.
View team standings across leagues.
Features
Authentication: JWT-based authentication for secure login and registration.
Fantasy Teams: Users can create teams, draft riders, and manage rosters.
Leagues: Users can join and compete in leagues.
Real-time Data: Integration with ProCyclingStats to fetch rider rankings (or use mock data if needed).
Responsive Design: Mobile-friendly UI built with React.
RESTful API: Backend built using Flask, serving data to the React frontend.
Technologies Used
Backend (Flask)
Flask: Python web framework.
Flask-JWT-Extended: JWT-based authentication.
Flask-SQLAlchemy: Database ORM for managing models and queries.
Flask-Migrate: Handling database migrations.
SQLAlchemy: SQL ORM for database interactions.
BeautifulSoup: Web scraping for real-world cycling data.
Gunicorn: WSGI HTTP Server for deployment.
Frontend (React)
React: JavaScript library for building user interfaces.
Redux: State management for handling user and team data.
React Router: Navigation between pages.
Axios: HTTP client for API requests.
Redux Toolkit: Simplified Redux setup and slice management.
Setup and Installation
Prerequisites
Make sure you have the following installed:

Python (3.8 or higher)
Node.js (v14 or higher) and npm
Pipenv (for managing Python environments)
Backend Setup
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/Fantasy_Cycling.git
cd Fantasy_Cycling/server
Set up the virtual environment and install dependencies:

bash
Copy code
pipenv install
Create a .env file in the server/ directory with the following variables:

bash
Copy code
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///fantasy_tdf.db
JWT_SECRET_KEY=your-jwt-secret-key
Initialize the database:

bash
Copy code
pipenv run flask db init
pipenv run flask db migrate
pipenv run flask db upgrade
Seed the database with mock data:

bash
Copy code
pipenv run python seed.py
Frontend Setup
Navigate to the client/ directory:

bash
Copy code
cd ../client
Install the required dependencies:

bash
Copy code
npm install
Create a .env file in the client/ directory with the following variables:

bash
Copy code
REACT_APP_API_URL=http://localhost:5000
Running the App
Backend (Flask)
Activate the virtual environment:

bash
Copy code
pipenv shell
Run the Flask server:

bash
Copy code
flask run
Frontend (React)
Start the React development server:

bash
Copy code
npm start
Accessing the Application
Once both servers are running, open your browser and navigate to:

arduino
Copy code
http://localhost:3000
Folder Structure
bash
Copy code
Fantasy_Cycling/
├── server/                 # Flask backend
│   ├── app/                # Application code (models, routes, etc.)
│   ├── migrations/         # Database migration files
│   ├── config.py           # Flask configuration
│   ├── seed.py             # Database seeding script
│   ├── run.py              # Entry point for the backend server
│   └── requirements.txt    # Python dependencies
├── client/                 # React frontend
│   ├── public/             # Public assets and index.html
│   ├── src/                # Source code for React app
│   └── package.json        # Node dependencies
├── README.md               # Project documentation
└── Pipfile                 # Python environment and dependency management
API Endpoints
Here are some key API endpoints used in the application:

Authentication
POST /auth/register: Register a new user.
POST /auth/login: Log in a user.
POST /auth/refresh: Refresh the JWT access token.
GET /auth/user: Get the current logged-in user's details.
Teams
POST /teams: Create a new fantasy team.
GET /teams: Get all teams for the logged-in user.
PUT /teams/:team_id/roster: Update the team's roster.
Riders
GET /riders: Get a list of all riders.
GET /riders/rankings: Get the rider rankings (available without login).
Stages
GET /stages: Get all stages.
GET /stages/:stage_id/results: Get results for a specific stage.
Leagues
POST /leagues: Create a new league.
POST /leagues/:league_id/join: Join an existing league.
Future Improvements
Real-time updates: Integrate WebSockets for real-time team updates and live race tracking.
Notifications: Add email or in-app notifications for team updates or important race events.
Advanced statistics: Provide more in-depth stats for riders and teams, including performance charts.