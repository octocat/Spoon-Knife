import base64
import json
import requests


def gethtml(url):
    try:
        resp = requests.request('get', url)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding
        print(resp.text)
        return resp.text
    except:
        print('err')


def getProblem():
    url = "http://47.102.118.1:8089/api/problem?stuid=031804124"
    # 每次请求的结果都不一样，动态变化
    text = json.loads(gethtml(url))
    # print(text.keys())#dict_keys(['img', 'step', 'swap', 'uuid'])
    # text["img"] = "none" #{'img': 'none', 'step': 0, 'swap': [7, 7], 'uuid': '3bc827e5008d460b893e5cb28769e6bf'}
    img_base64 = text["img"]
    step = text["step"]
    swap = text["swap"]
    uuid = text["uuid"]
    img = base64.b64decode(img_base64)
    # 获取接口的图片并写入本地
    with open("photo.jpg", "wb") as fp:
        fp.write(img)  # 900*900

getProblem()