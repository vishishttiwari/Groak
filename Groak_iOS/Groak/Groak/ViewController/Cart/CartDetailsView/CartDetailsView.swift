//
//  CartDetailView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/4/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This shows the detailed dish in cart in scroll form

import Foundation
import UIKit

internal class CartDetailsView: UIScrollView {
    
    // Optional Closures
    internal var orderAltered: ((_ cartDish: CartDish) -> ())?
    
    private let detailsTitle: UILabel = UILabel()
    private let details: UILabel = UILabel()
    private let specialInstructionsTitle: UILabel = UILabel()
    private let specialInstructions: UITextView = UITextView()
    private let addDishButton: UIButton = UIButton()
    private let quantity: UILabel = UILabel()
    private let reduceDishButton: UIButton = UIButton()
    
    private var cartDish: CartDish = CartDish.init()
    
    private let placeholder: String! = "Leave a note for the kitchen"
    
    required init(cartDish: CartDish) {
        super.init(frame: .zero)
        
        self.cartDish = cartDish
        
        self.backgroundColor = .white
        self.showsVerticalScrollIndicator = true
        self.isUserInteractionEnabled = true
        self.keyboardDismissMode = .onDrag
        
        setupCartDish()
        setupAdditionalComments()
        setupQuantity()
    }
    
    private func setupCartDish() {
        var extras: [DishExtra] = []
        for extra in cartDish.extras {
            extras.append(DishExtra.init(cartDishExtra: extra))
        }
        
        detailsTitle.text = "Order Details"
        detailsTitle.numberOfLines = 0
        detailsTitle.font = UIFont(name: FontCatalog.fontLevels[3], size: 25)
        detailsTitle.lineBreakMode = .byTruncatingTail
        detailsTitle.textAlignment = .left
        detailsTitle.textColor = .black
        self.addSubview(detailsTitle)
        
        details.text = Catalog.showExtras(dishExtras: extras, showSpecialInstructions: false)
        details.numberOfLines = 0
        details.lineBreakMode = .byTruncatingTail
        details.textAlignment = .left
        details.textColor = .black
        details.font = UIFont(name: FontCatalog.fontLevels[1], size: 18)
        details.sizeToFit()
        self.addSubview(details)
        
        detailsTitle.translatesAutoresizingMaskIntoConstraints = false
        details.translatesAutoresizingMaskIntoConstraints = false
        
        detailsTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        detailsTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        detailsTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        details.topAnchor.constraint(equalTo: detailsTitle.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        details.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        details.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    private func setupAdditionalComments() {
        specialInstructionsTitle.text = "Special Instructions"
        specialInstructionsTitle.numberOfLines = 0
        specialInstructionsTitle.font = UIFont(name: FontCatalog.fontLevels[3], size: 25)
        specialInstructionsTitle.lineBreakMode = .byTruncatingTail
        specialInstructionsTitle.textAlignment = .left
        specialInstructionsTitle.textColor = .black
        self.addSubview(specialInstructionsTitle)
        
        if let lastExtra = cartDish.extras.last, lastExtra.options.count <= 0 {
            specialInstructions.text = placeholder
            specialInstructions.textColor = .lightGray
        } else {
            specialInstructions.text = cartDish.extras.last?.options[0].title
            specialInstructions.textColor = .black
        }
        specialInstructions.delegate = self
        specialInstructions.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        specialInstructions.backgroundColor = .clear
        specialInstructions.textAlignment = .left
        specialInstructions.layer.cornerRadius = DimensionsCatalog.cornerRadius
        specialInstructions.clipsToBounds = true
        specialInstructions.keyboardAppearance = .dark
        specialInstructions.layer.borderWidth = 1.0
        specialInstructions.layer.borderColor = ColorsCatalog.shadesOfGray[5].cgColor
        self.addSubview(specialInstructions)
        
        specialInstructionsTitle.translatesAutoresizingMaskIntoConstraints = false
        specialInstructions.translatesAutoresizingMaskIntoConstraints = false
        
        specialInstructionsTitle.topAnchor.constraint(equalTo: details.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructionsTitle.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructionsTitle.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        specialInstructions.topAnchor.constraint(equalTo: specialInstructionsTitle.bottomAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        specialInstructions.widthAnchor.constraint(equalToConstant: DimensionsCatalog.screenSize.width - 2*(DimensionsCatalog.distanceBetweenElements)).isActive = true
        specialInstructions.heightAnchor.constraint(equalToConstant: 100).isActive = true
    }
    
    private func setupQuantity() {
        addDishButton.setImage(#imageLiteral(resourceName: "plus"), for: .normal)
        addDishButton.addTarget(self, action: #selector(add), for: .touchUpInside)
        self.addSubview(addDishButton)
        
        reduceDishButton.setImage(#imageLiteral(resourceName: "minus"), for: .normal)
        reduceDishButton.addTarget(self, action: #selector(reduce), for: .touchUpInside)
        self.addSubview(reduceDishButton)
        
        quantity.text = "\(cartDish.quantity)"
        quantity.font = UIFont(name: FontCatalog.fontLevels[0], size: DimensionsCatalog.viewControllerFooterDimensions.priceSize)
        quantity.numberOfLines = 0
        quantity.textColor = .black
        quantity.backgroundColor = .clear
        quantity.lineBreakMode = .byTruncatingTail
        quantity.textAlignment = .center
        self.addSubview(quantity)
        
        quantity.translatesAutoresizingMaskIntoConstraints = false
        addDishButton.translatesAutoresizingMaskIntoConstraints = false
        reduceDishButton.translatesAutoresizingMaskIntoConstraints = false
        
        quantity.topAnchor.constraint(equalTo: specialInstructions.bottomAnchor, constant: 3*DimensionsCatalog.distanceBetweenElements).isActive = true
        quantity.centerXAnchor.constraint(equalTo: self.centerXAnchor).isActive = true
        quantity.widthAnchor.constraint(equalToConstant: DimensionsCatalog.screenSize.width/4).isActive = true
        quantity.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        quantity.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        addDishButton.centerYAnchor.constraint(equalTo: quantity.centerYAnchor).isActive = true
        addDishButton.leftAnchor.constraint(equalTo: quantity.rightAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        addDishButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        addDishButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        
        reduceDishButton.centerYAnchor.constraint(equalTo: quantity.centerYAnchor).isActive = true
        reduceDishButton.rightAnchor.constraint(equalTo: quantity.leftAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        reduceDishButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
        reduceDishButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerFooterDimensions.priceSize).isActive = true
    }
    
    // When quantity is added, price is changed
    @objc func add() {
        self.cartDish.quantity += 1
        self.cartDish.price = Catalog.calculateTotalPriceOfDish(pricePerItem: self.cartDish.pricePerItem, quantity: self.cartDish.quantity)
        quantity.text = "\(self.cartDish.quantity)"
        orderAltered?(cartDish)
    }
    
    
    // When quantity is reduced, price is changed
    @objc func reduce() {
        if (self.cartDish.quantity > 1) {
            self.cartDish.quantity -= 1
            self.cartDish.price = Catalog.calculateTotalPriceOfDish(pricePerItem: self.cartDish.pricePerItem, quantity: self.cartDish.quantity)
            quantity.text = "\(self.cartDish.quantity)"
            orderAltered?(cartDish)
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

// This is used to set a placeholder in text view.
// Text view does not have any placeholder so all this drama has to be done.
// When the view is empty then it is replaced with gray text.
// When the user is writing the if there is a gray text then it is all removed,
extension CartDetailsView: UITextViewDelegate {
    func textViewDidBeginEditing(_ textView: UITextView) {
        if textView.textColor == UIColor.lightGray {
            textView.text = nil
            textView.textColor = UIColor.black
        }
    }
    
    func textViewDidEndEditing(_ textView: UITextView) {
        if textView.text.isEmpty {
            textView.text = placeholder
            textView.textColor = UIColor.lightGray
        }
    }
    
    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        
        let finalText =  NSString(string: textView.text).replacingCharacters(in: range, with: text)
        
        if (finalText.count == 0) {
            cartDish.extras.last?.options.removeAll()
        } else {
            if (cartDish.extras.last?.options.count == 0) {
                if text == "\n" {
                    cartDish.extras.last?.options.append(CartDishExtraOption.init(title: textView.text, price: 0, optionIndex: 0))
                    textView.resignFirstResponder()
                    return false
                } else {
                    cartDish.extras.last?.options.append(CartDishExtraOption.init(title: finalText, price: 0, optionIndex: 0))
                }
            } else {
                if text == "\n" {
                    cartDish.extras.last?.options[0] = CartDishExtraOption.init(title: textView.text, price: 0, optionIndex: 0)
                    textView.resignFirstResponder()
                    return false
                } else {
                    cartDish.extras.last?.options[0] = CartDishExtraOption.init(title: finalText, price: 0, optionIndex: 0)
                }
            }
        }
        orderAltered?(cartDish)
        
        return true
    }
    
    func scrollToBottom(){
        let bottomOffset = CGPoint(x: 0, y: contentSize.height - bounds.size.height)
        setContentOffset(bottomOffset, animated: false)
    }
}
