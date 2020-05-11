#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May 10 23:03:18 2020

@author: vishishttiwari
"""

from csv import reader

class Read_CSV:
    
    @classmethod
    def findCSV(cls): 
        emailList = []
        index = 0
        with open('emails.csv', 'r') as read_obj:
            index+=1
            csv_reader = reader(read_obj)
            list_of_rows = list(csv_reader)
            for i in list_of_rows:
                emailList.append(i[0])
                if (index >= 90):
                    break
        print(emailList)
        return emailList