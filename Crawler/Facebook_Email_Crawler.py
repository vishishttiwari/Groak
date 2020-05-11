# -*- coding: utf-8 -*-
"""
Created on Fri May  8 15:18:13 2020

@author: vishishttiwari
"""

from selenium.common.exceptions import NoSuchElementException 
import os

path = os.path.abspath(os.getcwd()) + "/"
emailFile = "Emails_Good_Cities_5" + ".csv"
goodWords = ['restaurant', 'Restaurant', 'food', 'Food']
goodCities = [
'alameda',
'elcerrito',
'mountainview',
'sanleandro',
'albany',
'emeryville',
'napa',
'sanmateo',
'americancanyon',
'fairfax',
'newark',
'sanpablo',
'antioch',
'fairfield',
'novato',
'sanrafael',
'atherton',
'fostercity',
'oakland',
'sanramon',
'belmont',
'fremont',
'oakley',
'santaclara',
'belvedere',
'gilroy',
'orinda',
'santarosa',
'benicia',
'halfmoonbay',
'pacifica',
'saratoga',
'berkeley',
'hayward',
'paloalto',
'sausalito',
'brentwood',
'healdsburg',
'petaluma',
'sebastopol',
'brisbane',
'hercules',
'piedmont',
'sonoma',
'burlingame',
'hillsborough',
'pinole',
'southsanfrancisco',
'calistoga',
'lafayette',
'pittsburg',
'st.helena',
'campbell',
'larkspur',
'pleasanthill',
'suisuncity',
'clayton',
'livermore',
'pleasanton',
'sunnyvale',
'cloverdale',
'losaltos',
'portolavalley',
'tiburon',
'colma',
'losaltoshills',
'redwoodcity',
'unioncity',
'concord',
'losgatos',
'richmond',
'vacaville',
'cortemadera',
'martinez',
'riovista',
'vallejo',
'cotati',
'menlopark',
'rohnertpark',
'walnutcreek',
'cupertino',
'millvalley',
'ross',
'windsor',
'dalycity',
'millbrae',
'sananselmo',
'woodside',
'danville',
'milpitas',
'sanbruno',
'yountville',
'dixon',
'montesereno',
'sancarlos',
'dublin',
'moraga',
'sanfrancisco',
'eastpaloalto',
'morganhill',
'sanjose',
'sacramento',
'folsom'
]

class Facebook_Email_Crawler:

    @classmethod
    def __writeToFile(cls, restaurant):
        if os.path.exists(path + emailFile):
            append_write = 'a' # append if already exists
        else:
            append_write = 'w' # make a new file if not
        
        fle = open(path + emailFile, append_write)
        fle.write(restaurant)
    
    @classmethod
    def __findName(cls, driver):
        nameWebElement = driver.find_element_by_class_name('_64-f')
        try:
            name = nameWebElement.find_element_by_tag_name('span')
            return name.text
        except NoSuchElementException:
            return ""
        return ""
        
        
    @classmethod
    def __findEmail(cls, driver):
        emailWebElements = driver.find_elements_by_class_name('_4bl9');
            
        for element in emailWebElements:
            try:
                element.find_element_by_partial_link_text('@')
            except NoSuchElementException:
                continue
            email = element.find_element_by_partial_link_text('@')
            return email.text
        
        return ""
        
    @classmethod
    def __findAddress(cls, driver):
        addressWebElements = driver.find_elements_by_class_name('_4bl9')
        finalAddress = ""
        
        for element in addressWebElements:
            addresses = element.find_elements_by_class_name('_2iem')
            if (len(addresses) <= 0):
                continue
            
            for address in addresses:
                if (len(finalAddress) != 0):
                    finalAddress += ", " + address.text
                else:
                    finalAddress += address.text
            break
        
        return finalAddress
        
    @classmethod
    def __findNumber(cls, driver):
        phoneWebElements = driver.find_elements_by_class_name('_4bl9')
        for element in phoneWebElements:
            try:
                driver.find_element_by_class_name('_50f4')
            except NoSuchElementException:
                continue
            phone = driver.find_element_by_class_name('_50f4').text
            if ("Call" in phone):
                return phone
            else:
                continue
            
        return ""
    
    @classmethod
    def __findCategory(cls, driver):
        categoryWebElement = driver.find_element_by_class_name('_5m_o')
        return categoryWebElement.text
    
    @classmethod
    def restaurantLink(cls, driver):
        email = cls.__findEmail(driver)
        name = cls.__findName(driver)
        address = cls.__findAddress(driver)
        number = cls.__findNumber(driver)
        category = cls.__findCategory(driver)
        
        found = False
        for word in goodWords:
            if word in category:
                found = True
                
        print(name + " is valid: " + str(found))
                
        if (found):
        
            finalData = email + "," + name + "," + number + "," + category + "," + address
            
            splitData = finalData.split(',')
            
            for (i, data) in enumerate(splitData):
                splitData[i] = data.lstrip()
                
            city = splitData[-2].lower().replace(" ", "")
            
            if not city in goodCities:
                print(name + " not in vicinity. It is in " + splitData[-2])
                return False;
                
                
            finalString = ','.join(splitData) + '\n'
        
            if (len(splitData[0]) > 0):
                print(finalString)
                cls.__writeToFile(finalString)
            
        return found