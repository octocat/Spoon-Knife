import requests
import datetime
# PyJWT 
import jwt
import time
from urllib.parse import urlencode
  
payload = {
    'access_key': 'j2w74sBS4yKusLupxqNJLCB8V5UpVPhgOwUGFuFi',
    'nonce': int(time.time() * 1000),
}

jwt_token = jwt.encode(payload, 'Zdc1ENpSaW4hhOVZ2ovsw5GuMbWGiQwyBcuxayJC',).decode('utf8')
authorization_token = 'Bearer {}'.format(jwt_token)  

print(authorization_token)




#https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=btc_krw
payload = {"currency_pair": "btc_krw"}
r = requests.get("https://api.korbit.co.kr/v1/ticker/detailed", params=payload)
bitcoin = r.json()      #json()매서드-> text를 딕셔너리 타입으로 변환
print(bitcoin)
print(type(bitcoin))
print(bitcoin['last'])
print(bitcoin['timestamp'])

date = datetime.datetime.fromtimestamp(bitcoin['timestamp']/1000)
print(date)
strtime = date.strftime("%Y-%m-%d %H:%M:%S")
print(strtime)

