//
//  ClassCatalog.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class UITableViewHeader: UITableViewHeaderFooterView {
    private let background: UIView = UIView()
    internal let title: UILabel = UILabel()
    internal let subTitle: UILabel = UILabel()
    
    override init(reuseIdentifier: String?) {
        super.init(reuseIdentifier: reuseIdentifier)
        setupViews()
        setupInitialLayout()
    }
    
    private func setupViews() {
        background.backgroundColor = .white
        
        title.numberOfLines = 1
        title.textAlignment = .left
        title.textColor = .black
        title.font = UIFont(name: FontCatalog.fontLevels[3], size: 25)
        title.backgroundColor = .white
        
        subTitle.numberOfLines = 1
        subTitle.textAlignment = .left
        subTitle.textColor = ColorsCatalog.grayColor
        subTitle.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        subTitle.backgroundColor = .white
        
        self.addSubview(background)
        self.addSubview(title)
        background.addSubview(subTitle)
    }
    
    private func setupInitialLayout() {
        background.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        subTitle.translatesAutoresizingMaskIntoConstraints = false
        
        background.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        background.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        background.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        background.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        title.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        title.leftAnchor.constraint(equalTo: self.leftAnchor, constant: 10).isActive = true
        title.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -10).isActive = true
        title.heightAnchor.constraint(equalToConstant: DimensionsCatalog.tableHeaderHeight).isActive = true
        
        subTitle.topAnchor.constraint(equalTo: title.bottomAnchor).isActive = true
        subTitle.leftAnchor.constraint(equalTo: background.leftAnchor, constant: 10).isActive = true
        subTitle.rightAnchor.constraint(equalTo: background.rightAnchor, constant: -10).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}


internal class UITableViewCellWithArrow: UITableViewCell {
    private var container: UIView = UIView()
    internal let title: UILabel = UILabel()
    private let arrow: UIImageView = UIImageView()
    
    private let distanceBetweenElements: CGFloat = 40
    private let buttonDimensions: CGFloat = 20
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectedColor()
        
        title.textColor = .black
        title.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        
        arrow.image = #imageLiteral(resourceName: "go")
        
        container.addSubview(title)
        container.addSubview(arrow)
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        title.translatesAutoresizingMaskIntoConstraints = false
        arrow.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        container.heightAnchor.constraint(equalToConstant: DimensionsCatalog.UITableViewCellWithArrowHeight).isActive = true
        let containerBottomConstraint = container.bottomAnchor.constraint(equalTo: self.bottomAnchor)
        containerBottomConstraint.priority = UILayoutPriority.init(999)
        containerBottomConstraint.isActive = true
        
        title.topAnchor.constraint(equalTo: container.topAnchor).isActive = true
        title.leftAnchor.constraint(equalTo: container.leftAnchor).isActive = true
        title.rightAnchor.constraint(equalTo: arrow.leftAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        title.bottomAnchor.constraint(equalTo: container.bottomAnchor).isActive = true
        
        arrow.centerYAnchor.constraint(equalTo: title.centerYAnchor).isActive = true
        arrow.rightAnchor.constraint(equalTo: container.rightAnchor).isActive = true
        arrow.widthAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
        arrow.heightAnchor.constraint(equalToConstant: buttonDimensions).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

internal class LocalBadgeView: UIView {
    private let local: UILabel = UILabel()
    
    private var text: String = "YOUR ORDER"
    private let distanceBetweenElements: CGFloat = 5
    
    required init(isOrder: Bool) {
        super.init(frame: .zero)
        
        if !isOrder {
            text = "YOUR INSTRUCTION"
        }
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .clear
        self.layer.borderColor = ColorsCatalog.greenColor.cgColor
        self.layer.borderWidth = 2
        self.layer.cornerRadius = 5
        
        local.text = text
        local.font = UIFont(name: FontCatalog.fontLevels[1], size: 12)
        local.backgroundColor = .clear
        local.textColor = ColorsCatalog.greenColor
        local.textAlignment = .left
        local.clipsToBounds = true
        self.addSubview(local)
    }
    
    private func setupInitialLayout() {
        local.translatesAutoresizingMaskIntoConstraints = false
        
        local.topAnchor.constraint(equalTo: self.topAnchor, constant: distanceBetweenElements).isActive = true
        local.leftAnchor.constraint(equalTo: self.leftAnchor, constant: distanceBetweenElements).isActive = true
        local.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -distanceBetweenElements).isActive = true
        local.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

internal class ViewControllerWithPan: UIViewController {

    var initialTouchPoint: CGPoint = CGPoint(x: 0, y: 0)

    override func viewDidLoad() {
        super.viewDidLoad()

        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(handlePanGesture(_:)))
        view.addGestureRecognizer(panGesture)
    }

    @objc func handlePanGesture(_ sender: UIPanGestureRecognizer) {
        let touchPoint = sender.location(in: self.view?.window)
        let percent = max(sender.translation(in: view).x, 0) / view.frame.width
        let velocity = sender.velocity(in: view).x

        if sender.state == UIGestureRecognizer.State.began {
            initialTouchPoint = touchPoint
        } else if sender.state == UIGestureRecognizer.State.changed {
            if touchPoint.x - initialTouchPoint.x > 0 {
                self.view.frame = CGRect(x: touchPoint.x - initialTouchPoint.x, y: 0, width: self.view.frame.size.width, height: self.view.frame.size.height)
            }
        } else if sender.state == UIGestureRecognizer.State.ended || sender.state == UIGestureRecognizer.State.cancelled {
            if percent > 0.5 || velocity > 1000 {
                UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                    self.view.frame = CGRect(x: self.view.frame.size.width, y: 0, width: self.view.frame.size.width, height: self.view.frame.size.height)
                })
                DispatchQueue.main.asyncAfter(deadline: .now() + TimeCatalog.animateTime) {
                    self.dismiss(animated: false, completion: nil)
                }
            } else {
                UIView.animate(withDuration: TimeCatalog.animateTime, animations: {
                    self.view.frame = CGRect(x: 0, y: 0, width: self.view.frame.size.width, height: self.view.frame.size.height)
                })
            }
        }
    }
}
