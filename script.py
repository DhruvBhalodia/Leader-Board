# Instructions are taken from https://nander.cc/using-selenium-within-a-docker-container
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def set_chrome_options() -> Options:
    """Sets chrome options for Selenium.
    Chrome options for headless browser is enabled.
    """
    chrome_options = Options()
    chrome_options.binary_location = "/usr/bin/google-chrome"
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_prefs = {}
    chrome_options.experimental_options["prefs"] = chrome_prefs
    chrome_prefs["profile.default_content_settings"] = {"images": 2}
    return chrome_options


driver = webdriver.Chrome(options=set_chrome_options())

driver.get("https://leetcode.com/u/daivik_hirpara/")

for _ in range(3):  # Retry 3 times
    try:
        elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.text-label-1.dark\\:text-dark-label-1.flex.items-center.text-2xl'))
        )
        if elements:
            print("hii")
            break
    except Exception:
        time.sleep(2)  # Wait before retrying

print("Completed")
driver.close()
