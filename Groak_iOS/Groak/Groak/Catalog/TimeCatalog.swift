//
//  TimeCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Catalog file is used to access random time related information all across the project

import Foundation
import Firebase

internal class TimeCatalog {
    
    // Animation time for different things such as time takes for options view to show up
    static let animateTime: Double! = 0.25
    
    // The amount of time after logging into an account after which the user is thrown out
    static let leaveRestaurantTimeInHours = 3 * 3600
    // This is used to show the animation time for the bottom sheet in intro screen to go up or down
    static let bottomSheetGoUpAgainTimeInSeconds = 10
    
    // Get which day it is
    static func getDay() -> String {
        let todayDate = Date()
        let myCalendar = Calendar(identifier: .gregorian)
        let weekDay = myCalendar.component(.weekday, from: todayDate)
        if weekDay == 1 {
            return "sunday"
        } else if weekDay == 2 {
            return "monday"
        } else if weekDay == 3 {
            return "tuesday"
        } else if weekDay == 4 {
            return "wednesday"
        } else if weekDay == 5 {
            return "thursday"
        } else if weekDay == 6 {
            return "friday"
        } else if weekDay == 7 {
            return "saturday"
        }
        return ""
    }
    
    // Get how many minutes have passed since midnight to judge if a category is available
    static func getTimeInMinutes() -> Int {
        let date = Date()
        let calendar = Calendar.current
        
        let hour = calendar.component(.hour, from: date)
        let minutes = calendar.component(.minute, from: date)
        
        return hour*60 + minutes
    }
    
    // Get time in string from a timestamp
    static func getTimeFromTimestamp(timestamp: Timestamp) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "h:mm a"
        formatter.amSymbol = "AM"
        formatter.pmSymbol = "PM"

        let timeString = formatter.string(from: timestamp.dateValue())
        return timeString
    }
    
    // Get both date and time in string from a timestamp
    static func getDateTimeFromTimestamp(timestamp: Timestamp) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "h:mm a\tMMMM dd, yyyy"
        formatter.amSymbol = "AM"
        formatter.pmSymbol = "PM"

        let timeString = formatter.string(from: timestamp.dateValue())
        return timeString
    }
    
    // Get date in string from a timestamp
    static func getDateFromTimestamp(timestamp: Timestamp) -> Date {
        return timestamp.dateValue()
    }
}
