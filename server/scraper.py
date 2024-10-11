import requests
from bs4 import BeautifulSoup
import random

def scrape_procyclingstats_rankings():
    url = "https://www.procyclingstats.com/rankings.php"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    riders = []
    table = soup.find('table', class_='basic')
    
    if table:
        rows = table.find_all('tr')[1:]  # Skip the header row
        for row in rows:
            cols = row.find_all('td')
            if len(cols) >= 5:
                try:
                    rank = int(cols[0].text.strip())
                    name_element = cols[2].find('a')
                    if name_element:
                        name = name_element.text.strip()
                    else:
                        name = cols[2].text.strip()
                    team = cols[3].text.strip()
                    points = int(cols[4].text.strip().replace(',', ''))
                    
                    riders.append({
                        'rank': rank,
                        'name': name,
                        'team': team,
                        'career_points': points
                    })
                except (ValueError, AttributeError, IndexError) as e:
                    print(f"Error processing row: {e}")
                    continue

    return riders

def generate_mock_riders(count=50):
    riders = []
    teams = ["Team Sky", "Movistar Team", "Quick-Step Floors", "BMC Racing Team", "Mitchelton-Scott"]
    for i in range(count):
        riders.append({
            'rank': i + 1,
            'name': f"Rider {i + 1}",
            'team': random.choice(teams),
            'career_points': random.randint(100, 10000)
        })
    return riders

if __name__ == "__main__":
    scraped_riders = scrape_procyclingstats_rankings()
    if not scraped_riders:
        print("No riders scraped. Generating mock data.")
        scraped_riders = generate_mock_riders()
    print(f"Scraped/Generated {len(scraped_riders)} riders")
    for rider in scraped_riders[:5]:  # Print first 5 riders for verification
        print(rider)