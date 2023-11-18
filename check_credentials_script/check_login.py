from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys
from flask import Flask, jsonify

app = Flask(__name__)

# example call: http://127.0.0.1:5000/checkLogin/jakeaccount/password
@app.route('/checkLogin/<string:username>/<string:password>', methods=['GET'])

def checkLogin(username, password):

    print('username,pw: ' + username + ',' + password)

    # URL for Steam login
    steam_login_url = 'https://store.steampowered.com/login/'

    # Initialize the browser
    chrome_options = Options()
    #chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 10)

    # Access the Steam login page
    driver.get(steam_login_url)
    #wait = input("Press Enter to continue.")

    # Locate and populate the username and password fields
    #wait = input("Press Enter to continue. Creds will be entered")
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "qrcode_Bit_2Yuvr")))
    driver.find_element(By.XPATH, "//input[@type='text']").send_keys(username)
    driver.find_element(By.XPATH, "//input[@type='password']").send_keys(password)

    # Submit the login form
    #wait = input("Press Enter to continue. Login will be submitted")
    driver.find_element(By.XPATH, "//button[@type='submit']").click()

    # Capture the current URL after login attempt
    #wait = input("Press Enter to continue. Current url will be captured")

    # sleep for 5 seconds while login loads
    time.sleep(5)

    current_url = driver.current_url #"https://store.steampowered.com/"#
    print('current url: ' + current_url)

    # Check if login was successful based on the redirected URL
    result = False
    if current_url == "https://store.steampowered.com/":
        print("Login successful.")
        result = True
    elif current_url == "https://store.steampowered.com/login/":
        print("Login unsuccessful.")
        result = False
    else:
        print("redirect url not recognized")
        result = False
    
    return jsonify({'result': result})

    # Close the browser
    driver.quit()

if __name__ == "__main__":
    app.run(debug=True)

