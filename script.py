from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up the WebDriver (this example uses Chrome)
driver = webdriver.Chrome()

driver.get("https://leetcode.com/u/daivik_hirpara/")

for _ in range(3):  # Retry 3 times
    try:
        elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.text-label-1.dark\\:text-dark-label-1.flex.items-center.text-2xl'))
        )
        if elements:
            print("hii")
    except Exception:
        time.sleep(2)  # Wait before retrying

driver.close()
