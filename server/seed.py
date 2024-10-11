from app import create_app, db
from app.models import Stage, Rider, StageResult
from scraper import scrape_procyclingstats_rankings, generate_mock_riders
from datetime import date, timedelta
import random
from config import Config

app = create_app(Config)

# def seed_riders():
#     riders_data = scrape_procyclingstats_rankings()
#     if not riders_data:
#         print("Scraping failed. Using mock data.")
#         riders_data = generate_mock_riders()
    
#     riders = []
#     for rider_data in riders_data:
#         rider = Rider(
#             name=rider_data['name'],
#             rank=rider_data['rank'],
#             career_points=rider_data['points'],
#             is_gc=random.choice([True, False])  # Randomly assign GC status
#         )
#         riders.append(rider)
#     db.session.add_all(riders)
#     db.session.commit()
#     return riders

def generate_mock_riders(count=100):
    riders = []
    for i in range(count):
        riders.append({
            'name': f"Rider {i + 1}",
            'rank': i + 1,
            'points': random.randint(100, 5000)
        })
    return riders

def seed_riders():
    riders_data = generate_mock_riders(100)  # Generate 100 mock riders
    
    riders = []
    for rider_data in riders_data:
        rider = Rider(
            name=rider_data['name'],
            rank=rider_data['rank'],
            career_points=rider_data['points'],
            is_gc=random.choice([True, False])  # Randomly assign GC status
        )
        riders.append(rider)
    db.session.add_all(riders)
    db.session.commit()
    return riders

def seed_stages():
    start_date = date(2024, 7, 1)  # Assuming the Tour starts on July 1, 2024
    stages = []
    stage_number = 1
    time_trials = [5, 20]  # Stage numbers for time trials (e.g., stage 5 and 20)

    for i in range(1, 24):  # 21 stages + 2 rest days = 23 days
        if i in [8, 15]:  # Rest days after stage 7 and 14
            stage = Stage(
                number=0,  # Use 0 for rest days
                date=start_date + timedelta(days=i-1),
                type="Rest Day",
                is_rest_day=True
            )
        else:
            if stage_number in time_trials:
                stage_type = 'Time Trial'
            else:
                stage_type = random.choice(['Flat', 'Mountain'])
            
            stage = Stage(
                number=stage_number,
                date=start_date + timedelta(days=i-1),
                type=stage_type,
                is_rest_day=False
            )
            stage_number += 1
        stages.append(stage)
    
    db.session.add_all(stages)
    db.session.commit()
    return stages

def seed_stage_results(riders, stages):
    for stage in stages:
        if not stage.is_rest_day:
            for rider in riders:
                if stage.type == 'Time Trial':
                    time = random.randint(3600, 7200)  # 1 to 2 hours (in seconds)
                else:
                    time = random.randint(14400, 15800)  # 4 to 4.4 hours (in seconds)
                
                result = StageResult(
                    rider_id=rider.id,
                    stage_id=stage.id,
                    time=time,
                    sprint_pts=random.randint(0, 50) if stage.type == 'Flat' else 0,
                    mountain_pts=random.randint(0, 50) if stage.type == 'Mountain' else 0
                )
                db.session.add(result)
    db.session.commit()

def main():
    with app.app_context():
        # Ensure all tables are created
        db.create_all()
        
        print("Seeding riders...")
        riders = seed_riders()
        print(f"Seeded {len(riders)} riders")
        
        print("Seeding stages...")
        stages = seed_stages()
        print(f"Seeded {len(stages)} stages (including 2 rest days and 2 time trials)")
        
        print("Seeding stage results...")
        seed_stage_results(riders, stages)
        print("Seeded stage results")

        print("Database seeding completed!")

if __name__ == "__main__":
    main()