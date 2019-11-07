//
//  Catalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class Catalog {
    // When a new restaurant is loaded, its saved here.
    static var restaurant: Restaurant = Restaurant.init()
    
    // When a new table is loaded, its saved here.
    static var tableName: String = "Table1"
    static var tableId: String = "/restaurants/nlPL7XcUGbgIAVCQZhpZ/tables/Gbda3crlfwqXC3329QOA"
    
    // When a user signsup or logs in, his info is saved here
    static let user = "Bawika Punshi"
    static let userId = "users/FQcASd3K3kuvQCKLNqgc"
    
    // This cell is used as a special id for special instructions cell in the whole project
    static let specialInstructionsId = "specialInstructionsCellIdABCD1234"
    
    // Top and bottom safe area
    static var topSafeArea: CGFloat! = 0
    static var bottomSafeArea: CGFloat! = 0
    
    // Sizes for different things used in project
    static let screenSize = UIScreen.main.bounds.size
    static let tableHeaderHeight: CGFloat = 50
    static let imageHeights = 50 + Catalog.screenSize.width/2
    static let optionsViewWidth = 3*Catalog.screenSize.width/4
    
    // Animation time for different things such as time takes for options view to show up
    static let animateTime: Double! = 0.3
    
    // Different fonts used. As you go up in array, same font starts becoming bolder.
    static let fontLevels: [String] = ["AvenirNext-UltraLight", "Avenir-Light", "Avenir-Medium", "Avenir-Heavy", "Avenir-Black"]
    static let handwrittenFont: String = "BradleyHandITCTT-Bold"
    
    // Font used for buttons such as order etc.
    static let buttonFont: UIFont = UIFont(name: Catalog.fontLevels[3], size: 25)!
    
    // This color is used for headers. This is same as background of uitableview.
    static let headerGrayShade: UIColor = Catalog.shadesOfGray[1]
    // This color is the theme color. Right now its maroon
    static let themeColor: UIColor! = UIColor.init(red: 128/255, green: 0/255, blue: 0/255, alpha: 1)
    // This color is used for see cart and see order button
    static let greenColor: UIColor! = UIColor.init(red: 0/255, green: 128/255, blue: 0/255, alpha: 1)
    // This color is used for gray color for secondry test like food info
    static let grayColor: UIColor! = UIColor.init(red: 80/255, green: 80/255, blue: 80/255, alpha: 1)
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
    
    // This is actually to add gradient to give an effect that one thing is over other. Did not use it in the end
    static let gradientHeight: CGFloat = 50
    static let gradientTransparency: CGFloat = 0.3
    
    // Simple alert views. Nothing special
    static func alert(vc: UIViewController?, title: String, message: String) {
        guard let view = vc else { return }
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Ok", style: .cancel, handler: nil))
        view.present(alert, animated: true, completion: nil)
    }
}

// This extension is used to add blur and dark background to views
extension UIView {
    // Blur background
    func addBlurInBackground() {
        let blurView = UIVisualEffectView(effect:  UIBlurEffect.init(style: .dark))
        blurView.frame = self.frame
        blurView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        self.addSubview(blurView)
    }
    
    // Add dark to background
    func addDarkInBackground(alpha: CGFloat) {
        let darkView = UIView()
        darkView.backgroundColor = UIColor.black.withAlphaComponent(alpha)
        darkView.frame = self.frame
        darkView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        self.addSubview(darkView)
    }
    
    // Add gradient to a view. Like green at the top and blue at bottom
    func addGradientTop(parentView: UIView, topView: UIView) {
        self.isUserInteractionEnabled = false
        parentView.addSubview(self)
        
        self.translatesAutoresizingMaskIntoConstraints = false
        self.topAnchor.constraint(equalTo: topView.bottomAnchor).isActive = true
        self.leftAnchor.constraint(equalTo: parentView.leftAnchor).isActive = true
        self.rightAnchor.constraint(equalTo: parentView.rightAnchor).isActive = true
        self.heightAnchor.constraint(equalToConstant: Catalog.gradientHeight).isActive = true
        
        let gradient:CAGradientLayer = CAGradientLayer()
        gradient.frame = CGRect.init(x: 0, y: 0, width: Catalog.screenSize.width, height: Catalog.gradientHeight)
        gradient.colors = [UIColor.black.withAlphaComponent(Catalog.gradientTransparency).cgColor, UIColor.clear.cgColor] //Or any colors
        self.layer.addSublayer(gradient)
    }
    
    // Add gradient to a view. Like green at the top and blue at bottom
    func addGradientBottom(parentView: UIView, topView: UIView) {
        self.isUserInteractionEnabled = false
        parentView.addSubview(self)
        
        self.translatesAutoresizingMaskIntoConstraints = false
        self.topAnchor.constraint(equalTo: topView.bottomAnchor).isActive = true
        self.leftAnchor.constraint(equalTo: parentView.leftAnchor).isActive = true
        self.rightAnchor.constraint(equalTo: parentView.rightAnchor).isActive = true
        self.heightAnchor.constraint(equalToConstant: Catalog.gradientHeight).isActive = true
        
        let gradient:CAGradientLayer = CAGradientLayer()
        gradient.frame = CGRect.init(x: 0, y: 0, width: Catalog.screenSize.width, height: Catalog.gradientHeight)
        gradient.colors = [UIColor.clear.cgColor, UIColor.black.withAlphaComponent(Catalog.gradientTransparency).cgColor] //Or any colors
        self.layer.addSublayer(gradient)
    }
}

// This extension adds round corners to any views
extension UIView {
    func roundCorners(_ corners: CACornerMask, radius: CGFloat) {
        if #available(iOS 11, *) {
            self.layer.cornerRadius = radius
            self.layer.maskedCorners = corners
        } else {
            var cornerMask = UIRectCorner()
            if(corners.contains(.layerMinXMinYCorner)){
                cornerMask.insert(.topLeft)
            }
            if(corners.contains(.layerMaxXMinYCorner)){
                cornerMask.insert(.topRight)
            }
            if(corners.contains(.layerMinXMaxYCorner)){
                cornerMask.insert(.bottomLeft)
            }
            if(corners.contains(.layerMaxXMaxYCorner)){
                cornerMask.insert(.bottomRight)
            }
            let path = UIBezierPath(roundedRect: self.bounds, byRoundingCorners: cornerMask, cornerRadii: CGSize(width: radius, height: radius))
            let mask = CAShapeLayer()
            mask.path = path.cgPath
            self.layer.mask = mask
        }
    }
}

// This is used for caching images
let imageCache = NSCache<AnyObject, AnyObject>()
extension UIImageView {
    func loadImageUsingCache(url: String, available: Bool = true) {
        if (url.count == 0) { return }
        
        self.image = nil
        
        if let cachedImage = imageCache.object(forKey: url as AnyObject) as? UIImage {
            if (available) {
                self.image = cachedImage
            } else {
                let originalImage = cachedImage
                self.image = grayScale(originalImage: originalImage)
            }
            return
        }
        
        guard let imageURL: URL = Foundation.URL(string: url) else { return }
        
        URLSession.shared.dataTask(with: imageURL) { (data, response, error) in
            guard let data = data else { return }
            if (error == nil) {
                DispatchQueue.main.async {
                    if let downloadedImage = UIImage.init(data: data) {
                        imageCache.setObject(downloadedImage, forKey: url as AnyObject)
                        
                        if (available) {
                            self.image = downloadedImage
                        } else {
                            let originalImage = downloadedImage
                            self.image = self.grayScale(originalImage: originalImage)
                        }
                    }
                }
            }
        }.resume()
    }
    
    // To make an image grayscale
    func grayScale(originalImage: UIImage) -> UIImage {
        
        let context = CIContext(options: nil)
        let currentFilter = CIFilter(name: "CIPhotoEffectNoir")
        currentFilter!.setValue(CIImage(image: originalImage), forKey: kCIInputImageKey)
        let output = currentFilter!.outputImage
        let cgimg = context.createCGImage(output!,from: output!.extent)
        return UIImage(cgImage: cgimg!)
    }
}

// This is used to set the color the cell becomes when it is selected
extension UITableViewCell {
    func selectedColor() {
        let bgColorView = UIView()
        bgColorView.backgroundColor = Catalog.shadesOfGray[0]
        self.selectedBackgroundView = bgColorView
    }
}

extension String {
    var isAlphanumeric: Bool {
        return !isEmpty && range(of: "[^a-zA-Z0-9]", options: .regularExpression) == nil
    }
}
