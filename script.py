import requests
import pandas as pd
from bs4 import BeautifulSoup
import json

def leetcode_respose(username):
    URL = "https://leetcode.com/graphql"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    query = {
        "query": """
        query userContestRanking($username: String!) {
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                topPercentage
            }
        }
        """,
        "variables": {
            "username": username
        }
    }
    
    res = requests.post(URL, json=query, headers=headers)

    return res

def codeforces_responce(username):
    url = f"https://codeforces.com/api/user.info?handles={username}"
    response = requests.get(url)
    return response

def get_codechef_profile(username):
    url = username
    response = requests.get(url)
    if response.status_code == 200:
        response = response.text
        soup = BeautifulSoup(response, 'html.parser')
        rating = soup.find('div', class_='rating-number')
        src = "codechef.jpg"
        star = ""
        total = 0
        if rating:
            rating = int(rating.text)
            total = soup.find('div', class_='contest-participated-count')
            total = total.text.strip()
            total = int(''.join(filter(str.isdigit, total)))
            if rating < 1400:
                star = "⭐"
            elif rating < 1600:
                star = "⭐⭐"
            elif rating < 1800:
                star = "⭐⭐⭐"
            elif rating < 2000:
                star = "⭐⭐⭐⭐"
            elif rating < 2200:
                star = "⭐⭐⭐⭐⭐"
            elif rating < 2500:
                star = "⭐⭐⭐⭐⭐⭐"
            else:
                star = "⭐⭐⭐⭐⭐⭐⭐"
        else:
            rating = -1
        obj = {
            "rating" : rating,
            "star" : star,
            "img" : src,
            "total": total
        }
        return obj
    else:
        return -1
    
def extract_id(url_or_username):
    if "://" in url_or_username:
        parts = url_or_username.split('/')
        return parts[-1] if parts[-1] else parts[-2]
    else:
        return url_or_username

sheet_url = 'https://docs.google.com/spreadsheets/d/1ydXE103zECxjatsGliDnTSL5RDPNufcjNaA5B_3PTmo/export?format=csv'
df = pd.read_csv(sheet_url)

output_json = 'codechef.json'
output_data = []

for _, user in df.iterrows():
    if pd.notna(user['Codechef ID']) and user['Codechef ID']:
        username = extract_id(user['Codechef ID'])
    else:
        continue
    obj = get_codechef_profile(user["Codechef ID"])
    output_user_data = {
        "name": user['Name (First & Last Name)'],
        "year": user["Year of Joining the Institute "],
        "id": username,
        "stars": obj["star"],
        "codechefRating": obj["rating"],
        "totalContest": obj["total"],
        "img":obj["img"],
        "url":user["Codechef ID"]
    }
    output_data.append(output_user_data)

with open(output_json, 'w') as file:
    json.dump(output_data, file, indent=4)

output_json = 'leetcode.json'
output_data = []

for _, user in df.iterrows():

    if pd.notna(user['Leetcode ID']) and user['Leetcode ID']:
        username = extract_id(user['Leetcode ID'])
    else:
        continue
    res = leetcode_respose(username)
    rating = 0
    star = ""
    total = 0
    img = ""

    if res.status_code == 200:
        data = res.json()
        if 'data' in data and 'userContestRanking' in data['data'] and data['data']['userContestRanking']:
            rating = data['data']['userContestRanking']['rating']
            star = data['data']['userContestRanking']['topPercentage']
            total = data['data']['userContestRanking']['attendedContestsCount']
            img = data['data']['userContestRanking']['attendedContestsCount']

    output_user_data = {
        "name": user['Name (First & Last Name)'],
        "year": user["Year of Joining the Institute "],
        "id": username,
        "stars": "Top " + str(star) + "%",
        "leetcodeRating": round(rating),
        "totalContest": total,
        "img": "leetcode.jpg",
        "url": user["Leetcode ID"]
    }
    output_data.append(output_user_data)

with open(output_json, 'w') as file:
    json.dump(output_data, file, indent=4)

output_json = 'codeforces.json'
output_data = []

for _, user in df.iterrows():

    if pd.notna(user['Codeforces ID']) and user['Codeforces ID']:
        username = extract_id(user['Codeforces ID'])
    else:
        continue
    response = codeforces_responce(username)
    rating = 0
    star = ""
    total = 0
    img = ""

    if response.status_code == 200:
        data = response.json()
        if data.get('status') == 'OK':
            rating = data['result'][0].get('rating', -1)
            total = 10
            star = data['result'][0].get('rank', "")
            img = data['result'][0].get('titlePhoto', "")

    output_user_data = {
        "name": user['Name (First & Last Name)'],
        "year": user["Year of Joining the Institute "],
        "id": username,
        "stars": star,
        "codeforcesRating": round(rating),
        "totalContest": total,
        "img": img,
        "url": user["Codeforces ID"]
    }
    output_data.append(output_user_data)

with open(output_json, 'w') as file:
    json.dump(output_data, file, indent=4)
