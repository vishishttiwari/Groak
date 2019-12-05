//
//  SpecialInstructionsCartCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 12/3/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class SpecialInstructionsCartCell: UITableViewCell {
    internal var commentAdded: ((_ comment: String) -> ())?
    
    private let container: UIView = UIView()
    private let specialInstructions: UITextView = UITextView()
    internal let specialInstructionsShow: UILabel = UILabel()
    
    private let placeholder: String! = "Any other instructions? (Ex: Please start with starters.)"
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        self.selectionStyle = .none
        
        specialInstructions.text = placeholder
        specialInstructions.delegate = self
        specialInstructions.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        specialInstructions.backgroundColor = .clear
        specialInstructions.textAlignment = .left
        specialInstructions.textColor = .lightGray
        specialInstructions.layer.cornerRadius = DimensionsCatalog.cornerRadius
        specialInstructions.clipsToBounds = true
        specialInstructions.keyboardAppearance = .dark
        container.addSubview(specialInstructions)
        
        specialInstructionsShow.text = ""
        specialInstructionsShow.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        specialInstructionsShow.numberOfLines = 0
        specialInstructionsShow.textColor = ColorsCatalog.grayColor
        specialInstructionsShow.lineBreakMode = .byTruncatingTail
        specialInstructionsShow.textAlignment = .left
        specialInstructionsShow.sizeToFit()
        container.addSubview(specialInstructionsShow)
        
        self.addSubview(container)
    }
    
    private func setupInitialLayout() {
        container.translatesAutoresizingMaskIntoConstraints = false
        specialInstructions.translatesAutoresizingMaskIntoConstraints = false
        specialInstructionsShow.translatesAutoresizingMaskIntoConstraints = false
        
        container.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        container.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        container.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        container.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        
        specialInstructions.topAnchor.constraint(equalTo: container.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.heightAnchor.constraint(equalToConstant: 100).isActive = true
        specialInstructions.bottomAnchor.constraint(equalTo: specialInstructionsShow.topAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        specialInstructionsShow.leftAnchor.constraint(equalTo: container.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructionsShow.rightAnchor.constraint(equalTo: container.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructionsShow.bottomAnchor.constraint(equalTo: container.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}


// This is used to set a placeholder in text view.
// Text view does not have any placeholder so all this drama has to be done.
// When the view is empty then it is replaced with gray text.
// When the user is writing the if there is a gray text then it is all removed,
extension SpecialInstructionsCartCell: UITextViewDelegate {
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
        if text == "\n" {
            if (textView.text != "") {
                commentAdded?(textView.text)
                textView.text = placeholder
                textView.textColor = UIColor.lightGray
            }
            textView.resignFirstResponder()
            return false
        }
        return true
    }
}
