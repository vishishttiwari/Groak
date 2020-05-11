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
initialLink = "https://www.facebook.com/theyellowchillisantaclara/"
goodWords = ['restaurant', 'Restaurant', 'food', 'Food']

# Set the driver for google chrome
chrome_path = path + "chromedriver"
driver = webdriver.Chrome(chrome_path)
driver.get(initialLink)

restaurantLinks = []
restaurantLinksSet = []

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
        
            print(ref)
            print(company)



findURLElements()
