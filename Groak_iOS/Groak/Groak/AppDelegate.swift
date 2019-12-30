//
//  AppDelegate.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit
import Firebase
import CoreLocation
import CoreData

// See why any of the textview is not working. Make a different common extension for textview
// Any new stuff will be added to order view controller
// Add a back button to BottomSheetView
// See when you come back from MenuViewController, how to make the list appear again
// Add times to orderviewcontroller'
// The special instructions is not working so look into that
// Use dimensions rather than contraints in Special Requests
// See if cell dynamically change size if image etc. is not present
// Loading indicator for view controllers
// Loading indicator for images
// Get the user out either after distance or after time 3 hours maybe
// Notifications
// Start with camera and also have, not your restaurant and then show table
// Detach firestore listeners
// Add screens for when location or camera is not activated
// Save your order locally in cache (permanent)
// When ready to pay add it to the server


// Screen for when location or camera not added
// Times in order
// Instructions in order
// Notifications

// Loading indicator for cell
// See if cells change size dynamically
// get the user out of restaurant when location changes and after 3 hours
// Detach listeners
// Vegetarian icons etc.

// Have temporary graphics
// Different graphics for different loading

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, CLLocationManagerDelegate {

    var window: UIWindow?

    private let locationManager = CLLocationManager()
    static var timer: Timer?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        setupLocation()
        
        FirebaseApp.configure()

        let baseViewController = IntroViewController()
        
        window = window ?? UIWindow(frame: UIScreen.main.bounds)
        window?.makeKeyAndVisible()
        window?.rootViewController = baseViewController
        
        return true
    }
    
    // This sets up the location manager for getting the current position of user
    private func setupLocation() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    // This function is called everytime the user changes position
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let userLocation = locations[0]
        if let restaurant = LocalRestaurant.restaurant.restaurant {
            let restaurantLocation = DistanceCatalog.createCLLocation(latitude: restaurant.latitude, longitude: restaurant.longitude)
            if DistanceCatalog.shouldLocationBeUpdated(location1: userLocation, location2: restaurantLocation) {
                LocalRestaurant.leaveRestaurant()
            }
        }
    }
    
    static func resetTimer() {
        timer = Timer.scheduledTimer(timeInterval: TimeInterval(TimeCatalog.leaveRestaurantTimeInHours), target: self, selector: #selector(leaveRestaurant), userInfo: nil, repeats: false)
    }
    
    static func stopTimer() {
        timer = nil
    }
    
    @objc static func leaveRestaurant() {
        if let _ = LocalRestaurant.restaurant.restaurant {
            LocalRestaurant.leaveRestaurant()
        }
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        PermissionsCatalog.askLocationPermission()
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    // MARK: - Core Data stack

    lazy var persistentContainer: NSPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
        */
        let container = NSPersistentContainer(name: "Groak")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                 
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()

    // MARK: - Core Data Saving support

    func saveContext () {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }
}
