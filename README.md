# Fantasy Cycling App

## Description

Fantasy Cycling App is a web application that allows users to create and manage fantasy cycling teams, track rider performances, and compete in custom leagues. The app consists of a Flask backend and a React frontend.

## Features

- Authentication: JWT-based authentication for secure login and registration
- Fantasy Teams: Users can create teams, draft riders, and manage rosters
- RESTful API: Backend built using Flask, serving data to the React frontend
- Create and manage fantasy cycling teams
- Draft and manage riders for teams
- View rider rankings and stage results
- View team standings across leagues

## Technologies Used

### Backend (Flask)

- Flask - Python web framework
- Flask-JWT-Extended - JWT-based authentication
- Flask-SQLAlchemy - Database ORM for managing models and queries
- Flask-Migrate - Handling database migrations
- SQLAlchemy - SQL ORM for database interactions
- BeautifulSoup - Web scraping for real-world cycling data
- Gunicorn - WSGI HTTP Server for deployment

### Frontend (React)

- React - JavaScript library for building user interfaces
- Redux - State management for handling user and team data
- React Router - Navigation between pages
- Axios - HTTP client for API requests
- Redux Toolkit - Simplified Redux setup and slice management

## Installation

### Prerequisites

Make sure you have the following installed:

- Python (3.8 or higher)
- Node.js (v14 or higher) and npm
- Pipenv (for managing Python environments)

### Backend Setup

1. Clone the repository:

```console
git clone https://github.com/your-username/Fantasy_Cycling.git
cd Fantasy_Cycling/server
```

2. Set up the virtual environment and install dependencies:

```console
pipenv install
```

3. Create a .env file in the server/ directory:

```console
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///fantasy_tdf.db
JWT_SECRET_KEY=your-jwt-secret-key
```

4. Initialize the database:
go to the server folder:
Fantasy_cycling/server$
```console
pipenv shell
flask db init
flask db migrate
flask db upgrade
```

5. Seed the database:

```console
python seed.py
```

### Frontend Setup
Wihtin another terminal.
1. Navigate to client directory:

```console
cd ../client
```

2. Install dependencies:
Within Fantasy_Cycling/client$
```
npm install
```

3. Create .env file:

```console
REACT_APP_API_URL=http://localhost:5555
```

## Usage

### Running the Backend
Within the server folder:
Fantasy_Cycling/server$
```console
pipenv shell (if not already running a virtual environment)
python run.py
```

### Running the Frontend
Within another terminal navigate to the client folder.
Fantasy_Cycling/client$
```console
npm start
```

Access the application at http://localhost:3000

## API Endpoints

### Authentication

- POST /auth/register - Register a new user
- POST /auth/login - Log in a user
- POST /auth/refresh - Refresh JWT access token
- GET /auth/user - Get current user details

### Teams

- POST /teams - Create new fantasy team
- GET /teams - Get all teams for logged-in user
- PUT /teams/:team_id/roster - Update team roster
- DELETE /teams - Delete fantasy team

### Riders

- GET /riders - Get all riders
- GET /riders/rankings - Get rider rankings
- POST /riders - Add riders to team or swap classifications
- DELETE /riders - Remove riders from teams

### Stages

- GET /stages - Get all stages
- GET /stages/:stage_id/results - Get specific stage results

## Future Improvements

- Moving to sessions and cookies instead of Client Side storing of JWT Tokens
- Real-time updates using WebSockets for live race tracking
- Email or in-app notifications for team updates and race events
- Advanced statistics with in-depth stats and performance charts for riders and teams

## Project Structure

```
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
```