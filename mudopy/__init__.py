from selenium import webdriver
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import requests
from pathlib import Path
from twilio.rest import Client 

from webdriver_manager.chrome import ChromeDriverManager


account_sid = 'ACa0339cfe585a0136ea02c360b734def2' 
auth_token = 'e7ffa648564de69dc7da6a9828139181' 
client = Client(account_sid, auth_token) 
def download_path(path:str):
        """add download path """
        try:
            file = open("down_path.txt","w")
            file.write(path)
            file.close()
        except:
            print("cannot write path")

def download(song, artist = None, play_after_downloading = True):
    """Downloads the video to given directory"""
    
    try:
        file=open("down_path.txt")
        down_path=file.read()
        down_path=down_path.strip()
        file.close()
        
    except:
        down_path = os.getcwd()

    print("It will not take more than 1 minute if your download speed is good")
    if artist:
        song=song+ ' by ' +artist
    video=song
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=chrome_options)
    #chromeOptions=Options()
    #chromeOptions.add_experimental_option("prefs",{"download.default_directory":down_path})
    #chromeOptions.add_argument("--headless")
    #service = Service(executable_path=ChromeDriverManager().install())

    #driver = webdriver.Chrome(service=service)
    #driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=chromeOptions)
    #driver = webdriver.Chrome(ChromeDriverManager(path=os.getcwd()).install(),options=chromeOptions)
    wait=WebDriverWait(driver,3)
    presence = EC.presence_of_element_located   
    visible = EC.visibility_of_element_located
    driver.get("https://www.youtube.com/results?search_query=" + str(video))
    ads =True
    wait.until(visible((By.ID, "video-title")))
    try:
        driver.find_element(By.XPATH,"//span[contains(@class,'style-scope ytd-badge-supported-renderer') and text()='Ad']")
    except Exception as e:
        ads=False
    if ads:    
        vid = driver.find_element(By.ID,"video-title")
        vid.click()
    else:
        vid = driver.find_element(By.ID,"video-title")
        vid.click()
    #driver.find_element(By.ID,"video-title").click()
    print(driver.current_url)
    url=driver.current_url
    driver.get("https://ytmp3.cc/en13/")
    driver.maximize_window()   
    driver.find_element(By.XPATH,"//*[@id='mp3']").click()
    driver.find_element(By.XPATH,"//*[@id='input']").send_keys(url)
    driver.find_element(By.XPATH,"//*[@id='submit']").click()
    time.sleep(6)
    driver.find_element(By.XPATH,"//*[@id='buttons' or @id='download']/span").click()
    driver.find_element(By.XPATH,'//*[@id="download_list"]/div[1]').click()
    print("Downloading")
    old_lst = os.listdir(down_path)
    while True:
            new_lst = os.listdir(down_path)
                
            if new_lst != old_lst:
                song = set(new_lst) - set(old_lst)
                song = str(song)
                song = song.replace("{","")
                song = song.replace("}","")
                song = song.strip("'")
                
                if Path(song).suffix == '.mp3':
                    driver.quit()
                    if play_after_downloading:
                        print("Song downloaded to :"+down_path)
                        print("playing")
                        os.startfile(down_path+"/"+song)
                        print(song)
                       
                    return "Song downloaded"
                    break

    print("Hello from the creator of Mudopy,Smit Parmar and Ankit Raj Mahapatra.Do report bug if any")
    print("set download path")
    print("mudopy.download_path(r'download path') #dont forget to use 'r' while set download path")
    file.close()
