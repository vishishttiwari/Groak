//
//  ColorsCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/7/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  Catalog file is used to access random colors related information all across the project

import UIKit

internal class ColorsCatalog {
    
    // This color is used for headers. This is same as background of uitableview.
    static let headerGrayShade: UIColor = shadesOfGray[1]
    
    // This color is the theme color. Right now its maroon
    static let themeColor: UIColor! = UIColor.init(red: 128/255, green: 0/255, blue: 0/255, alpha: 1)
    
    // This color is used for see cart and see order button
    static let greenColor: UIColor! = UIColor.init(red: 0/255, green: 128/255, blue: 0/255, alpha: 1)
    
    // This color is used for gray color for secondry test like food info
    static let grayColor: UIColor! = shadesOfGray[17]
    
    static let loadingBackground: UIColor! = UIColor.init(red: 1, green: 1, blue: 1, alpha: 0.5)
    
    // Different shades of gray. Mostly for fun and trial.
    static let shadesOfGray: [UIColor] = [UIColor.init(red: 250/255, green: 250/255, blue: 250/255, alpha: 1),
    UIColor.init(red: 240/255, green: 240/255, blue: 240/255, alpha: 1),
    UIColor.init(red: 230/255, green: 230/255, blue: 230/255, alpha: 1),
    UIColor.init(red: 220/255, green: 220/255, blue: 220/255, alpha: 1),
    UIColor.init(red: 210/255, green: 210/255, blue: 210/255, alpha: 1),
    UIColor.init(red: 200/255, green: 200/255, blue: 200/255, alpha: 1),
    UIColor.init(red: 190/255, green: 190/255, blue: 190/255, alpha: 1),
    UIColor.init(red: 180/255, green: 180/255, blue: 180/255, alpha: 1),
    UIColor.init(red: 170/255, green: 170/255, blue: 170/255, alpha: 1),
    UIColor.init(red: 160/255, green: 160/255, blue: 160/255, alpha: 1),
    UIColor.init(red: 150/255, green: 150/255, blue: 150/255, alpha: 1),
    UIColor.init(red: 140/255, green: 140/255, blue: 140/255, alpha: 1),
    UIColor.init(red: 130/255, green: 130/255, blue: 130/255, alpha: 1),
    UIColor.init(red: 120/255, green: 120/255, blue: 120/255, alpha: 1),
    UIColor.init(red: 110/255, green: 110/255, blue: 110/255, alpha: 1),
    UIColor.init(red: 100/255, green: 100/255, blue: 100/255, alpha: 1),
    UIColor.init(red: 90/255, green: 90/255, blue: 90/255, alpha: 1),
    UIColor.init(red: 80/255, green: 80/255, blue: 80/255, alpha: 1),
    UIColor.init(red: 70/255, green: 70/255, blue: 70/255, alpha: 1),
    UIColor.init(red: 60/255, green: 60/255, blue: 60/255, alpha: 1),
    UIColor.init(red: 50/255, green: 50/255, blue: 50/255, alpha: 1)]
}
