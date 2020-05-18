//
//  OrderCommentCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/6/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the comment cell in order view

import Foundation
import UIKit

internal class OrderCommentCell: UITableViewCell {
    private let container: UIView = UIView()
    private let comment: UILabel = UILabel()
    private let created: UILabel = UILabel()
    private let localBadgeView: LocalBadgeView = LocalBadgeView.init(isOrder: false)
    internal var commentFull: OrderComment = OrderComment.init() {
        didSet {
            comment.text = commentFull.comment
            created.text = TimeCatalog.getTimeFromTimestamp(timestamp: commentFull.created)
            
            localBadgeView.isHidden = !commentFull.local
        }
    }
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.isUserInteractionEnabled = false
        
        comment.text = ""
        comment.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        comment.numberOfLines = 0
        comment.textColor = .black
        comment.lineBreakMode = .byTruncatingTail
        comment.textAlignment = .left
        comment.sizeToFit()
        container.addSubview(comment)
        
        created.isTime()
        created.textColor = .black
        container.addSubview(created)
        
        container.addSubview(localBadgeView)
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        comment.translatesAutoresizingMaskIntoConstraints = false
        localBadgeView.translatesAutoresizingMaskIntoConstraints = false
        created.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        comment.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        comment.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        comment.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        localBadgeView.topAnchor.constraint(equalTo: comment.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        localBadgeView.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        localBadgeView.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        created.centerYAnchor.constraint(equalTo: localBadgeView.centerYAnchor).isActive = true
        created.widthAnchor.constraint(equalToConstant: DimensionsCatalog.screenSize.width/2).isActive = true
        created.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
}
