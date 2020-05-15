//
//  AppDelegate.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
// This is the main class called everytime app starts

import Foundation
import UIKit
import Firebase
import CoreLocation
import CoreData

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, CLLocationManagerDelegate {

    var window: UIWindow?

    private let locationManager = CLLocationManager()
    static var timer: Timer?
    static var badgeCountRequest: Int = 0
    static var badgeCountOrder: Int = 0
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {        
        
        // Setup location to see if the user is still at restaurant
        setupLocation()
        
        // configuring firebase
        FirebaseApp.configure()
        
        // To register for user notifications
        UserNotifications.shared.authorize()

        let baseViewController = IntroViewController()
        
        window = window ?? UIWindow(frame: UIScreen.main.bounds)
        window?.makeKeyAndVisible()
        window?.rootViewController = baseViewController
        
        return true
    }
    
    // Get curent location to see if the user is close to the restaurant all the time while going through menu
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
    
    // Timer is used to make the user leave the restaurant after some time
    static func resetTimer() {
        timer = Timer.scheduledTimer(timeInterval: TimeInterval(TimeCatalog.leaveRestaurantTimeInHours), target: self, selector: #selector(leaveRestaurant), userInfo: nil, repeats: false)
    }
    
    static func stopTimer() {
        timer = nil
    }
    
    // Make user leave restaurant
    @objc static func leaveRestaurant() {
        if let _ = LocalRestaurant.restaurant.restaurant {
            LocalRestaurant.leaveRestaurant()
        }
    }

    // Whenever the application starts, it checks if location is being allowed or not
    func applicationDidBecomeActive(_ application: UIApplication) {
        PermissionsCatalog.askLocationPermission()
        AppDelegate.badgeCountOrder = 0
        UIApplication.shared.applicationIconBadgeNumber = AppDelegate.badgeCountRequest + AppDelegate.badgeCountOrder
    }

    // Whenever application terminates, the restaurant is deleted. This is mostly for unsubscribing the snapshot listeners for requests and orders
    func applicationWillTerminate(_ application: UIApplication) {
        LocalRestaurant.deleteRestaurant()
//        FirebaseMessaging.shared = nil
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        
        let (topViewController, _) = Catalog.getTopAndRootViewControllers()
        
        if let category = userInfo["gcm.notification.category"] as? String {
            if category == "request" {
                if !(topViewController?.isKind(of: RequestViewController.self) ?? false) {
                    AppDelegate.badgeCountRequest += 1
                    Catalog.setRequestBadge()
                } else {
                    AppDelegate.badgeCountRequest = 0
                }
            }
            else if category == "order" {
                if !(topViewController?.isKind(of: TabbarViewController.self) ?? false) {
                    AppDelegate.badgeCountOrder += 1
                } else {
                    AppDelegate.badgeCountOrder = 0
                }
            }
            UIApplication.shared.applicationIconBadgeNumber = AppDelegate.badgeCountRequest + AppDelegate.badgeCountOrder
        }
        
        completionHandler(.newData)
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
