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
    // duration in for message
    static let messageTime: Double = 3
    
    // The amount of time after logging into an account after which the user is thrown out
    static let leaveRestaurantTimeInHours = 0.5 * 3600
    // This is used to show the animation time for the bottom sheet in intro screen to go up or down
    static let bottomSheetGoUpAgainTimeInSeconds = 10
    
    // This is used for covid chart
    static func getDaysInOrder() -> [String] {
        let todayDate = Date()
        let myCalendar = Calendar(identifier: .gregorian)
        let weekDay = myCalendar.component(.weekday, from: todayDate)
        if weekDay == 1 {
            return ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        } else if weekDay == 2 {
            return ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"]
        } else if weekDay == 3 {
            return ["wednesday", "thursday", "friday", "saturday", "sunday", "monday", "tuesday"]
        } else if weekDay == 4 {
            return ["thursday", "friday", "saturday", "sunday", "monday", "tuesday", "wednesday"]
        } else if weekDay == 5 {
            return ["friday", "saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"]
        } else if weekDay == 6 {
            return ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"]
        } else if weekDay == 7 {
            return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        }
        return []
    }
    
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
    
    // Get which day it is
    static func getShortDay(day: String) -> String {
        if day == "sunday" {
            return "Su"
        } else if day == "monday" {
            return "Mo"
        } else if day == "tuesday" {
            return "Tu"
        } else if day == "wednesday" {
            return "We"
        } else if day == "thursday" {
            return "Th"
        } else if day == "friday" {
            return "Fr"
        } else if day == "saturday" {
            return "Sa"
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
    
    // This function is used to set serveTime of 30 minutes for the first order placed at table
    static func addThirtyMinutesToTimestamp() -> Timestamp {
        return Timestamp.init(seconds: (Timestamp.init().dateValue().millisecondsSince1970/1000) + (30 * 60), nanoseconds: 0)
    }
}
