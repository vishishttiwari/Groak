//
//  UserNotifications.swift
//  Groak
//
//  Created by Vishisht Tiwari on 1/15/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit
import UserNotifications
import Messages

internal class UserNotifications: NSObject {
    
    static let shared = UserNotifications()
    let userNotificationCenter = UNUserNotificationCenter.current()
    
    private override init() {}
    
    func authorize() {
        let options: UNAuthorizationOptions = [.alert, .badge, .sound]
        
        userNotificationCenter.requestAuthorization(options: options) { (granted, error) in
            guard granted else { return }
            DispatchQueue.main.async {
                self.configure()
            }
        }
    }
    
    func configure() {
        userNotificationCenter.delegate = self
        
        let application = UIApplication.shared
        application.registerForRemoteNotifications()
    }
}

extension UserNotifications: UNUserNotificationCenterDelegate {
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        
        if LocalRestaurant.isRestaurantCreationSuccessful(), let restaurant = LocalRestaurant.restaurant.restaurant {
            if let category = response.notification.request.content.userInfo["gcm.notification.category"] as? String {
                var topViewController = UIApplication.shared.keyWindow?.rootViewController
                while let presentedViewController = topViewController?.presentedViewController {
                    topViewController = presentedViewController
                }
                if category == "request" {
                    AppDelegate.badgeCountRequest = 0
                    UIApplication.shared.applicationIconBadgeNumber = AppDelegate.badgeCountRequest + AppDelegate.badgeCountOrder
                    if !(topViewController?.isKind(of: RequestViewController.self) ?? true) {
                        let controller = RequestViewController(restaurant: restaurant)

                        topViewController?.view.coverHorizontalPresent()
                        controller.modalPresentationStyle = .overCurrentContext

                        DispatchQueue.main.async {
                            topViewController?.present(controller, animated: false, completion: nil)
                        }
                    }
                }
            }
        }
        
        completionHandler()
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        
        let options: UNNotificationPresentationOptions = [.alert, .sound, .badge]
        completionHandler(options)
    }
}
