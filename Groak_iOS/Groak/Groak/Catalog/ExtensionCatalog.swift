//
//  ExtensionCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/7/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import UIKit

// This is actually to add gradient to give an effect that one thing is over other. Did not use it in the end
let gradientHeight: CGFloat = 50
let gradientTransparency: CGFloat = 0.3

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
        self.heightAnchor.constraint(equalToConstant: gradientHeight).isActive = true
        
        let gradient:CAGradientLayer = CAGradientLayer()
        gradient.frame = CGRect.init(x: 0, y: 0, width: DimensionsCatalog.screenSize.width, height: gradientHeight)
        gradient.colors = [UIColor.black.withAlphaComponent(gradientTransparency).cgColor, UIColor.clear.cgColor] //Or any colors
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
        self.heightAnchor.constraint(equalToConstant: gradientHeight).isActive = true
        
        let gradient:CAGradientLayer = CAGradientLayer()
        gradient.frame = CGRect.init(x: 0, y: 0, width: DimensionsCatalog.screenSize.width, height: gradientHeight)
        gradient.colors = [UIColor.clear.cgColor, UIColor.black.withAlphaComponent(gradientTransparency).cgColor] //Or any colors
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
                DispatchQueue.global(qos: .userInitiated).async {
                    let tempImage = self.grayScale(originalImage: originalImage)
                    DispatchQueue.main.async {
                        self.image = tempImage
                    }
                }
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
                            DispatchQueue.global(qos: .userInitiated).async {
                                let tempImage = self.grayScale(originalImage: originalImage)
                                DispatchQueue.main.async {
                                    self.image = tempImage
                                }
                            }
                        }
                    }
                }
            }
        }.resume()
    }
    
    // To make an image grayscale
    func grayScale(originalImage: UIImage) -> UIImage {
        let context = CIContext(options: nil)
        let currentFilter = CIFilter(name: "CIPhotoEffectMono")
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
        bgColorView.backgroundColor = ColorsCatalog.shadesOfGray[0]
        self.selectedBackgroundView = bgColorView
    }
}

extension String {
    var isAlphanumeric: Bool {
        return !isEmpty && range(of: "[^a-zA-Z0-9]", options: .regularExpression) == nil
    }
}
