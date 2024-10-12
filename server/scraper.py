import requests
from bs4 import BeautifulSoup
import random

def scrape_procyclingstats_rankings():
    url = "https://www.procyclingstats.com/rankings.php"
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        riders = []
        table = soup.find('table', {'class': 'basic'})
        
        if table:
            rows = table.find_all('tr')[1:]  # Skip the header row
            for row in rows:
                cols = row.find_all('td')
                if len(cols) >= 7:
                    try:
                        rank = int(cols[0].text.strip())
                        name = cols[4].text.strip()
                        points = int(cols[6].text.strip())
                        
                        riders.append({
                            'rank': rank,
                            'name': name,
                            'points': points
                        })
                    except (ValueError, AttributeError, IndexError) as e:
                        print(f"Error processing row: {e}")
                        continue

        return riders

    except requests.RequestException as e:
        print(f"Error fetching data from ProCyclingStats: {e}")
        return []

def generate_mock_riders(count=50):
    riders = []
    for i in range(count):
        riders.append({
            'rank': i + 1,
            'name': f"Rider {i + 1}",
            'points': random.randint(100, 5000)
        })
    return riders

if __name__ == "__main__":
    print("Testing scraper...")
    scraped_riders = scrape_procyclingstats_rankings()
    if scraped_riders:
        print(f"Scraped {len(scraped_riders)} riders")
    else:
        print("Scraping failed. Generating mock data.")
        mock_riders = generate_mock_riders()
        print(f"Generated {len(mock_riders)} mock riders")