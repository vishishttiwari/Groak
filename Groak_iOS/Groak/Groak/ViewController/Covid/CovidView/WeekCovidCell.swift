//
//  WeekCovidSituationView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 6/21/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class WeekCovidCell: UITableViewCell {
    private var container: UIView = UIView()
    
    private var scale: ScaleView?
    private var days: [BarView] = []
    
    private let height: CGFloat = 280
    
    internal var restaurant: Restaurant = Restaurant.init() {
        didSet {
            for day in days {
                if let finalDay = day.day {
                    let height = CGFloat(restaurant.occupancy[finalDay] ?? 0)/CGFloat(restaurant.maximumOccupancy)
                    day.setDishHeight(height: height)
                }
            }
        }
    }
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        self.backgroundColor = .white
        
        let daysInOrder = TimeCatalog.getDaysInOrder()
        
        let width = (DimensionsCatalog.screenSize.width - (2*DimensionsCatalog.distanceBetweenElements))/8
        
        scale = ScaleView.init(height: height, width: width)
        for day in daysInOrder {
            days.append(BarView.init(day: day, height: height, width: width))
        }
        
        setupViews()
        setupInitialLayout(height: height, width: width)
    }
    
    private func setupViews() {
        container.addSubview(scale!)
        for day in days {
            container.addSubview(day)
        }
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout(height: CGFloat, width: CGFloat) {
        container.translatesAutoresizingMaskIntoConstraints = false
        scale?.translatesAutoresizingMaskIntoConstraints = false
        for day in days {
            day.translatesAutoresizingMaskIntoConstraints = false
        }
        
        container.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        let heightConstraint = container.heightAnchor.constraint(equalToConstant: height)
        heightConstraint.priority = UILayoutPriority(rawValue: 999)
        heightConstraint.isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        scale?.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        scale?.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        scale?.widthAnchor.constraint(equalToConstant: width).isActive = true
        scale?.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
        
        days[0].topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        days[0].leftAnchor.constraint(equalTo: scale!.rightAnchor).isActive = true
        days[0].widthAnchor.constraint(equalToConstant: width).isActive = true
        days[0].bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
        
        for (n, day) in days.enumerated() {
            if (n == 0) {
                continue
            }
            day.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
            day.leftAnchor.constraint(equalTo: days[n-1].rightAnchor).isActive = true
            day.widthAnchor.constraint(equalToConstant: width).isActive = true
            day.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

internal class BarView: UIView {
    private var barBackground: UIView = UIView.init()
    private var bar: UIView = UIView.init()
    private var label: UILabel = UILabel.init()
    
    fileprivate var day: String?
    
    private let textHeight: CGFloat = 20
    private let textRegionHeight: CGFloat = 30
    private var barHeight: CGFloat?
    
    required init(day: String, height: CGFloat, width: CGFloat) {
        super.init(frame: .zero)
        
        self.day = day
        
        barHeight = height - textRegionHeight - DimensionsCatalog.distanceBetweenElements
        
        setupViews(day: day, width: width)
        setupInitialLayout(height: height, width: width)
    }
    
    private func setupViews(day: String, width: CGFloat) {
        self.addSubview(barBackground)
        self.addSubview(bar)
        self.addSubview(label)
        
        barBackground.backgroundColor = ColorsCatalog.headerGrayShade
        barBackground.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner], radius: DimensionsCatalog.cornerRadius)
        
        bar.backgroundColor = ColorsCatalog.themeColor
        bar.roundCorners([.layerMaxXMinYCorner, .layerMinXMinYCorner], radius: width/4)
        
        label.text = TimeCatalog.getShortDay(day: day)
        label.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        label.numberOfLines = 0
        label.textColor = .black
        label.lineBreakMode = .byTruncatingTail
        label.textAlignment = .center
    }
    
    private func setupInitialLayout(height: CGFloat, width: CGFloat) {
        barBackground.frame.origin.x = width/4
        barBackground.frame.origin.y = 0
        barBackground.frame.size.width = width/2
        barBackground.frame.size.height = barHeight!
        
        bar.frame.origin.x = width/4
        bar.frame.origin.y = barHeight!
        bar.frame.size.width = width/2
        bar.frame.size.height = 0
        
        label.frame.origin.x = 0
        label.frame.origin.y = barHeight! + DimensionsCatalog.distanceBetweenElements
        label.frame.size.width = width
        label.frame.size.height = textRegionHeight
    }
    
    fileprivate func setDishHeight(height: CGFloat) {
        UIView.animate(withDuration: 2, animations: {
            self.bar.frame.origin.y = self.barHeight! * max(0, (1 - height))
            self.bar.frame.size.height = self.barHeight! * min(1, height)
        })
        
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

internal class ScaleView: UIView {
    private var quarter: UILabel = UILabel.init()
    private var half: UILabel = UILabel.init()
    private var thirdQuarter: UILabel = UILabel.init()
    
    private let textHeight: CGFloat = 10
    private let textRegionHeight: CGFloat = 30
    private var barHeight: CGFloat?
    
    required init(height: CGFloat, width: CGFloat) {
        super.init(frame: .zero)
        
        self.backgroundColor = .clear
        
        barHeight = height - textRegionHeight - DimensionsCatalog.distanceBetweenElements
        
        setupViews()
        setupInitialLayout(width: width)
    }
    
    private func setupViews() {
        self.addSubview(quarter)
        self.addSubview(half)
        self.addSubview(thirdQuarter)
        
        quarter.text = "25% - "
        quarter.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        quarter.numberOfLines = 0
        quarter.textColor = .black
        quarter.lineBreakMode = .byTruncatingTail
        quarter.textAlignment = .center
        
        half.text = "50% - "
        half.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        half.numberOfLines = 0
        half.textColor = .black
        half.lineBreakMode = .byTruncatingTail
        half.textAlignment = .center
        
        thirdQuarter.text = "75% - "
        thirdQuarter.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight)
        thirdQuarter.numberOfLines = 0
        thirdQuarter.textColor = .black
        thirdQuarter.lineBreakMode = .byTruncatingTail
        thirdQuarter.textAlignment = .center
    }
    
    private func setupInitialLayout(width: CGFloat) {
        quarter.translatesAutoresizingMaskIntoConstraints = false
        half.translatesAutoresizingMaskIntoConstraints = false
        thirdQuarter.translatesAutoresizingMaskIntoConstraints = false
        
        thirdQuarter.topAnchor.constraint(equalTo: self.topAnchor, constant: barHeight!/4 - width/2).isActive = true
        thirdQuarter.heightAnchor.constraint(equalToConstant: width).isActive = true
        thirdQuarter.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        thirdQuarter.widthAnchor.constraint(equalToConstant: width).isActive = true

        half.topAnchor.constraint(equalTo: self.topAnchor, constant: barHeight!/2 - width/2).isActive = true
        half.heightAnchor.constraint(equalToConstant: width).isActive = true
        half.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        half.widthAnchor.constraint(equalToConstant: width).isActive = true
        
        quarter.topAnchor.constraint(equalTo: self.topAnchor, constant: 3*barHeight!/4 - width/2).isActive = true
        quarter.heightAnchor.constraint(equalToConstant: width).isActive = true
        quarter.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        quarter.widthAnchor.constraint(equalToConstant: width).isActive = true
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

