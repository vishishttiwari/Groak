//
//  ReceiptOrderDish.swift
//  Groak
//
//  Created by Vishisht Tiwari on 1/13/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class ReceiptOrderDish: UIView {
    private let quantity: UILabel = UILabel()
    private let name: UILabel = UILabel()
    private let price: UILabel = UILabel()
    private let created: UILabel = UILabel()
    private let localBadge: UILabel = UILabel()
    private var dish: OrderDish
    
    private let textHeight: CGFloat = 20
    
    required init(dish: OrderDish) {
        self.dish = dish
        
        super.init(frame: CGRect.init(x: 0, y: 0, width: DimensionsCatalog.screenSize.width, height: 2*textHeight + 5*DimensionsCatalog.distanceBetweenElements))
        
        setupViews()
        
        setupInitialLayout()
        
        name.text = dish.name
        quantity.text = "\(dish.quantity)"
        price.text = dish.price.priceInString
        created.text = TimeCatalog.getTimeFromTimestamp(timestamp: dish.created)
        
        localBadge.isHidden = !dish.local
        
        var extras: [DishExtra] = []
        for extra in dish.extras {
            extras.append(DishExtra.init(orderDishExtra: extra))
        }
    }
    
    func getHeight() -> CGFloat {
        return 2*textHeight + 5*DimensionsCatalog.distanceBetweenElements
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.isUserInteractionEnabled = false
        
        quantity.text = ""
        quantity.font = UIFont(name: FontCatalog.fontLevels[3], size: textHeight - 5)
        quantity.numberOfLines = 0
        quantity.textColor = .black
        quantity.lineBreakMode = .byTruncatingTail
        quantity.textAlignment = .left
        self.addSubview(quantity)
        
        name.text = ""
        name.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight - 5)
        name.numberOfLines = 0
        name.textColor = .black
        name.lineBreakMode = .byTruncatingTail
        name.textAlignment = .left
        self.addSubview(name)
        
        price.text = ""
        price.font = UIFont(name: FontCatalog.fontLevels[1], size: textHeight - 5)
        price.numberOfLines = 0
        price.textColor = .black
        price.lineBreakMode = .byTruncatingTail
        price.textAlignment = .right
        self.addSubview(price)
        
        localBadge.text = "YOUR ORDER"
        localBadge.font = UIFont(name: FontCatalog.fontLevels[1], size: 12)
        localBadge.backgroundColor = .clear
        localBadge.textColor = ColorsCatalog.greenColor
        localBadge.textAlignment = .left
        localBadge.clipsToBounds = true
        self.addSubview(localBadge)
        
        created.isTime()
        created.textColor = .black
        self.addSubview(created)
    }
    
    private func setupInitialLayout() {
        quantity.frame.size.width = DimensionsCatalog.screenSize.width/10
        quantity.frame.size.height = textHeight
        quantity.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        quantity.frame.origin.y = 2*DimensionsCatalog.distanceBetweenElements
        
        name.frame.size.width = DimensionsCatalog.screenSize.width/2
        name.frame.size.height = quantity.frame.size.height
        name.frame.origin.x = quantity.frame.origin.x + quantity.frame.size.width + 2*DimensionsCatalog.distanceBetweenElements
        name.frame.origin.y = quantity.frame.origin.y
        
        price.frame.size.width = DimensionsCatalog.screenSize.width/6
        price.frame.size.height = quantity.frame.size.height
        price.frame.origin.x = DimensionsCatalog.screenSize.width - price.frame.size.width - DimensionsCatalog.distanceBetweenElements
        price.frame.origin.y = quantity.frame.origin.y
        
        localBadge.frame.size.width = 2*DimensionsCatalog.screenSize.width/3
        localBadge.frame.size.height = textHeight
        localBadge.frame.origin.x = DimensionsCatalog.distanceBetweenElements
        localBadge.frame.origin.y = quantity.frame.origin.y + quantity.frame.size.height + DimensionsCatalog.distanceBetweenElements
        
        created.frame.size.width = DimensionsCatalog.screenSize.width/3
        created.frame.size.height = localBadge.frame.size.height
        created.frame.origin.x = DimensionsCatalog.screenSize.width - created.frame.size.width - DimensionsCatalog.distanceBetweenElements
        created.frame.origin.y = localBadge.frame.origin.y
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
