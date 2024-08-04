import requests
import pandas as pd
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_codechef_profile_image(username):
    url = f'https://www.codechef.com/users/{username}'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        profile_image_element = soup.find('img', class_='profileImage')
        if profile_image_element:
            profile_image_url = profile_image_element['src']
            profile_image_url = urljoin(url, profile_image_url)
            return profile_image_url
        else:
            return "Profile image not found for this user"
    else:
        return "User profile not found or inaccessible"

def get_leetcode_profile_image(username):
    url = f"https://leetcode.com/{username}/"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        profile_image_element = soup.find('img', class_='h-20 w-20 rounded-lg object-cover')
        if profile_image_element:
            profile_image_url = profile_image_element['src']
            profile_image_url = urljoin(url, profile_image_url)
            return profile_image_url
        else:
            return "Profile image not found for this user"
    else:
        return "User profile not found or inaccessible"

def get_codeforces_profile_image(username):
    url = f"https://codeforces.com/profile/{username}/"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        profile_image_element = soup.find('img', style='margin:auto;vertical-align:middle;display:inline;')
        if profile_image_element:
            profile_image_url = profile_image_element['src']
            profile_image_url = urljoin(url, profile_image_url)
            return profile_image_url
        else:
            return "Profile image not found for this user"
    else:
        return "User profile not found or inaccessible"

def get_codechef_rating(username):
    url = f'https://www.codechef.com/users/{username}'
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    rating_element = soup.find('div', class_='rating-number')
    paths = soup.find_all('path')
    for path in paths:
        d_attribute = path.get('d')
        if 'L' in d_attribute:
            return 0
    if rating_element:
        return int(re.search(r'\d+', rating_element.text.strip()).group())
    else:
        return "Rating not found for this user"

def get_leetcode_rating(username):
    url = f"https://leetcode.com/{username}/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        rating_element = soup.find('div', {'class': 'text-label-1 dark:text-dark-label-1 flex items-center text-2xl'})
        if rating_element:
            return rating_element.text.strip()
        else:
            return "-1"
    else:
        return "Failed to retrieve data"

def get_codeforces_rating(username):
    url = f"https://codeforces.com/profile/{username}/"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        rating_element = soup.find('span', style='font-weight:bold;')
        if rating_element:
            rating = rating_element.get_text(strip=True)
            return int(rating)
        else:
            return 0
    else:
        return f"Failed to fetch data. Status code: {response.status_code}"

def total_contest_codechef(username):
    url = f'https://www.codechef.com/users/{username}'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        total = soup.find('div', class_='contest-participated-count')
        return int(re.search(r'\d+', total.text.strip()).group()) if total else "Total contest not found"
    else:
        return "User profile not found or inaccessible"

def total_contest_leetcode(username):
    url = f"https://leetcode.com/{username}/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        rating_element = soup.find_all('div', {'class': 'text-label-1 dark:text-dark-label-1 font-medium leading-[22px]'})
        if len(rating_element) >= 2:
            second_element_value = rating_element[1].text.strip()
            return int(second_element_value)
        return 0
    else:
        return "Failed to retrieve data"

def total_contest_codeforces(username):
    url = f"https://codeforces.com/contests/with/{username}/"
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    div = soup.find('td', {'class': 'dark left'})
    if div:
        text = div.get_text(strip=True)
        return int(text)
    else:
        return 0

def extract_id(url_or_username):
    if "://" in url_or_username:
        parts = url_or_username.split('/')
        return parts[-1] if parts[-1] else parts[-2]
    else:
        return url_or_username

def get_star_rating(rating):
    if rating < 1400:
        return "⭐"
    elif rating < 1600:
        return "⭐⭐"
    elif rating < 1800:
        return "⭐⭐⭐"
    elif rating < 2000:
        return "⭐⭐⭐⭐"
    elif rating < 2200:
        return "⭐⭐⭐⭐⭐"
    elif rating < 2500:
        return "⭐⭐⭐⭐⭐⭐"
    else:
        return "⭐⭐⭐⭐⭐⭐⭐"

def get_user_top(username):
    url = f"https://leetcode.com/{username}/"
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    time.sleep(5)
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    div = soup.find('div', {'class': 'text-label-1 dark:text-dark-label-1 text-2xl'})
    if div:
        text = div.get_text(strip=True)
        return str(text.strip("%"))
    else:
        return "Element not found"
    driver.quit()

def get_div_codeforces(rating):
    if rating <= 1199:
        return "Newbie"
    elif rating <= 1399:
        return "Pupil"
    elif rating <= 1599:
        return "Specialist"
    elif rating <= 1899:
        return "Expert"
    elif rating <= 2099:
        return "Candidate Master"
    elif rating <= 2299:
        return "Master"
    elif rating <= 2399:
        return "International Master"
    elif rating <= 2599:
        return "Grandmaster"
    elif rating <= 2999:
        return "International Grandmaster"
    elif rating >= 3000:
        return "Legendary Grandmaster"

# Read input data from input Excel file
excel_file = 'Sheet.xlsx' 
df = pd.read_excel(excel_file)

# Process CodeChef data
output_json = 'codechef.json'
output_data = []

for _, user in df.iterrows():
    username = ""
    year = int(re.search(r'\d+', user['Email']).group()[:4])
    if pd.notna(user['CodeChef ID']) and user['CodeChef ID']:
        username = extract_id(user['CodeChef ID'])
    else:
        continue

    rating = get_codechef_rating(username)
    rating = int(rating)
    star = get_star_rating(rating)
    total_contests = total_contest_codechef(username)
    if total_contests:
        total_contests = int(total_contests)

    output_data.append({
        "year": year,
        "username": username,
        "rating": rating,
        "star_rating": star,
        "total_contests": total_contests
    })

# Write CodeChef data to JSON file
with open(output_json, 'w') as json_file:
    json.dump(output_data, json_file, indent=4)

print(f"Data written to {output_json}")
