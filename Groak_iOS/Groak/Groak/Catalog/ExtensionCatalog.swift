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
    
    // This extension adds round corners to any views
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
    
    func customActivityIndicator() -> UIView{
        let dimensions = DimensionsCatalog.screenSize.width/3

        self.backgroundColor = ColorsCatalog.loadingBackground
        self.layer.cornerRadius = DimensionsCatalog.cornerRadius

        self.frame = CGRect(x: DimensionsCatalog.screenSize.width/2 - dimensions/2, y: DimensionsCatalog.screenSize.height/2 - dimensions/2, width: dimensions , height: dimensions)
        
        let loopImages = UIImageView()
        self.addSubview(loopImages)

        let imageListArray = [UIImage.init(imageLiteralResourceName: "loading1"),
                              UIImage.init(imageLiteralResourceName: "loading2"),
                              UIImage.init(imageLiteralResourceName: "loading3"),
                              UIImage.init(imageLiteralResourceName: "loading4"),
                              UIImage.init(imageLiteralResourceName: "loading5"),
                              UIImage.init(imageLiteralResourceName: "loading6"),
                              UIImage.init(imageLiteralResourceName: "loading7"),
                              UIImage.init(imageLiteralResourceName: "loading8"),
                              UIImage.init(imageLiteralResourceName: "loading9"),
                              UIImage.init(imageLiteralResourceName: "loading10"),
                              UIImage.init(imageLiteralResourceName: "loading11"),
                              UIImage.init(imageLiteralResourceName: "loading12"),
                              UIImage.init(imageLiteralResourceName: "loading13"),
                              UIImage.init(imageLiteralResourceName: "loading14"),
                              UIImage.init(imageLiteralResourceName: "loading15")]

        loopImages.animationImages = imageListArray
        loopImages.animationDuration = TimeInterval(0.8)
        loopImages.startAnimating()

        loopImages.translatesAutoresizingMaskIntoConstraints = false
        loopImages.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        loopImages.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        loopImages.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        loopImages.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true

        return self
    }
    
    func hideLoader(hideFrom : UIView){
        hideFrom.subviews.last?.removeFromSuperview()
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
        bgColorView.backgroundColor = ColorsCatalog.shadesOfGray[2]
        self.selectedBackgroundView = bgColorView
    }
}

extension String {
    var isAlphanumeric: Bool {
        return !isEmpty && range(of: "[^a-zA-Z0-9]", options: .regularExpression) == nil
    }
}

extension Double {
    var priceInString: String {
        return "$\(String(format: "%.2f", self))"
    }
}

extension UILabel {
    func viewControllerHeaderTitle(title: String) {
        text = title
        font = UIFont(name: FontCatalog.fontLevels[1], size: DimensionsCatalog.viewControllerHeaderDimensions.titleSize - 5)
        numberOfLines = 1
        textColor = .black
        textAlignment = .center
    }
    
    func isPrice(price: Double) {
        text = price.priceInString
        font = UIFont(name: FontCatalog.fontLevels[0], size: DimensionsCatalog.viewControllerFooterDimensions.priceSize)
        numberOfLines = 0
        textColor = .black
        backgroundColor = .clear
        lineBreakMode = .byTruncatingTail
        textAlignment = .center
    }
    
    func isTime() {
        font = UIFont(name: FontCatalog.fontLevels[1], size: 12)
        backgroundColor = .clear
        textAlignment = .right
        clipsToBounds = true
    }
    
    func colorBackgroundForegroundOfSubString(originalString: String, substrings: [String], backgroundColor: UIColor, foregroundColor: UIColor) {
        let s = originalString as NSString
        let att = NSMutableAttributedString(string: s as String)
        for substring in substrings {
            let r = s.range(of: substring, options: .caseInsensitive, range: .init(location: 0, length: s.length))
            if r.length > 0 {
                att.addAttribute(.backgroundColor, value: backgroundColor, range: r)
                att.addAttribute(.foregroundColor, value: foregroundColor, range: r)
            }
        }
        
        attributedText = att
    }
    
    func boldSubString(originalString: String, substrings: [String], font: UIFont) {
        let s = originalString as NSString
        let att = NSMutableAttributedString(string: s as String)
        let boldFontAttribute: [NSAttributedString.Key: Any] = [NSAttributedString.Key.font: font]
        for substring in substrings {
            let r = s.range(of: substring, options: .caseInsensitive, range: .init(location: 0, length: s.length))
            if r.length > 0 {
                att.addAttributes(boldFontAttribute, range: r)
            }
        }
        
        attributedText = att
    }
}

extension UIButton {
    func footerButton(title: String) {
        setTitle(title, for: .normal)
        titleLabel?.font = UIFont(name: FontCatalog.fontLevels[3], size: 25)!
        backgroundColor = ColorsCatalog.themeColor
        titleLabel?.textColor = .white
        layer.cornerRadius = 10
    }
}
