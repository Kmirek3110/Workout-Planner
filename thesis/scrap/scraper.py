# import urllib2
from bs4 import BeautifulSoup
import requests



if __name__ == "__main__":
    f = open("test.txt", "r")
    for line in f.readlines():
        close = line.split(',')
        print(close)
        # if len(close) > 1:
        #     exercise = close[1].split('<')[0]
        #     print(exercise)        
   
