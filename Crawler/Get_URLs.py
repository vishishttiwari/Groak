#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri May  8 15:18:13 2020

@author: vishishttiwari
"""

from selenium import webdriver
from Facebook_Email_Crawler import Facebook_Email_Crawler
from selenium.common.exceptions import NoSuchElementException 
import os

path = os.path.abspath(os.getcwd()) + "/"
initialLink1 = "https://www.facebook.com/theyellowchillisantaclara/"
initialLink2 = "https://www.facebook.com/ibgsj/"
initialLink3 = "https://www.facebook.com/sanskritindianfolsom/"
initialLink4 = "https://www.facebook.com/saffrontucson/"
goodWords = ['restaurant', 'Restaurant', 'food', 'Food']
restaurantLinks = [initialLink1, initialLink2, initialLink3, initialLink4]
restaurantLinksSet = [initialLink1, initialLink2, initialLink3, initialLink4]

# Set the driver for google chrome
chrome_path = path + "chromedriver"
driver = webdriver.Chrome(chrome_path)

def findURLElements():
    urlElements = driver.find_elements_by_class_name('_5u5j');
    
    for element in urlElements:
        try:
            element.find_element_by_class_name('fsm')
        except NoSuchElementException:
            continue
        
        try:
            element.find_element_by_class_name('_4-lu');
        except NoSuchElementException:
            continue

        company = element.find_element_by_class_name('fsm').text
        ref = element.find_element_by_class_name('_4-lu').get_attribute("href").split('?')[0]
        
        if (len(company) <= 0 or len(ref) <= 0):
            continue
        
        found = False
        for word in goodWords:
            if word in company:
                found = True
        
        if not found:
            continue
        
        if not (ref in restaurantLinksSet):
            restaurantLinks.append(ref)
            restaurantLinksSet.append(ref)

while (True):
    if (len(restaurantLinks) <= 0):
        input("Satisfy the security check on facebook")
        findURLElements()
    link = restaurantLinks.pop(0)
    
    print("Restaurants in list: " + str(len(restaurantLinks)))
    print("Looking into: " + link)
    
    driver.get(link + "about")
    try:
        valid = Facebook_Email_Crawler.restaurantLink(driver)
    except Exception:
        continue
    
    if (valid):
        driver.get(link)
        try:
            findURLElements()
        except Exception:
             continue
    else:
        print("")
