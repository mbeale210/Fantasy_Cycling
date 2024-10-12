from app import create_app, db
from app.models import Stage, Rider, StageResult, User, League, FantasyTeam
from scraper import scrape_procyclingstats_rankings, generate_mock_riders
from datetime import date, timedelta
import random

app = create_app()

def seed_riders():
    riders_data = scrape_procyclingstats_rankings()
    if not riders_data:
        riders_data = generate_mock_riders()
    
    for rider_data in riders_data:
        rider = Rider(
            name=rider_data['name'],
            rank=rider_data['rank'],
            career_points=rider_data['points'],
            is_gc=random.choice([True, False])
        )
        db.session.add(rider)
    db.session.commit()

def seed_stages():
    start_date = date(2024, 7, 1)
    stage_number = 1
    for i in range(23):
        if i in [7, 14]:  # Rest days
            stage = Stage(
                number=0,
                date=start_date + timedelta(days=i),
                type="Rest Day",
                is_rest_day=True
            )
        else:
            stage_type = random.choice(['Flat', 'Mountain', 'Time Trial'])
            stage = Stage(
                number=stage_number,
                date=start_date + timedelta(days=i),
                type=stage_type,
                is_rest_day=False
            )
            stage_number += 1
        db.session.add(stage)
    db.session.commit()

def seed_users():
    # Add the specified user
    brigid = User(username="Brigid", email="brigid@gmail.com")
    brigid.set_password("1234jkl!")
    db.session.add(brigid)

    # Add the other users
    for i in range(9):  # Changed to 9 to keep total number of users at 10
        user = User(username=f"user{i}", email=f"user{i}@example.com")
        user.set_password("password")
        db.session.add(user)
    db.session.commit()

def seed_leagues():
    users = User.query.all()
    league = League(name="Main League")
    for user in users:
        league.users.append(user)
    db.session.add(league)
    db.session.commit()

def seed_fantasy_teams():
    users = User.query.all()
    league = League.query.first()
    riders = Rider.query.all()
    for user in users:
        team = FantasyTeam(name=f"{user.username}'s Team", user_id=user.id, league_id=league.id)
        team_riders = random.sample(riders, 9)
        team.riders.extend(team_riders)
        db.session.add(team)
    db.session.commit()

def main():
    with app.app_context():
        db.create_all()
        seed_riders()
        seed_stages()
        seed_users()
        seed_leagues()
        seed_fantasy_teams()
        print("Database seeded successfully!")

if __name__ == "__main__":
    main()