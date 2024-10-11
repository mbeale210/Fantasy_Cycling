import requests
from bs4 import BeautifulSoup

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
                rank = cols[0].text.strip()
                name = cols[2].find('a').text.strip()
                team = cols[3].text.strip()
                points = cols[4].text.strip()
                
                riders.append({
                    'rank': int(rank),
                    'name': name,
                    'team': team,
                    'career_points': int(points.replace(',', ''))
                })

    return riders

if __name__ == "__main__":
    scraped_riders = scrape_procyclingstats_rankings()
    print(f"Scraped {len(scraped_riders)} riders")