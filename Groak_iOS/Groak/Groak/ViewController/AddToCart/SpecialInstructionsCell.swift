//
//  SpecialInstructionsCell.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  The special instructions cell is represented in this class.

import Foundation
import UIKit

internal class SpecialInstructionsCell: UITableViewCell {
    internal var commentAdded: ((_ comment: String) -> ())?
    
    private let specialInstructions: UITextView = UITextView()
    
    private let placeholder: String! = "Leave a note for the kitchen"
    private let cornerRadius: CGFloat = 10
    
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
        specialInstructions.textAlignment = .justified
        specialInstructions.textColor = .lightGray
        specialInstructions.layer.cornerRadius = cornerRadius
        specialInstructions.clipsToBounds = true
        specialInstructions.keyboardAppearance = .dark
        self.addSubview(specialInstructions)
    }
    
    private func setupInitialLayout() {
        specialInstructions.translatesAutoresizingMaskIntoConstraints = false
        
        specialInstructions.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        specialInstructions.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}


// This is used to set a placeholder in text view.
// Text view does not have any placeholder so all this drama has to be done.
// When the view is empty then it is replaced with gray text.
// When the user is writing the if there is a gray text then it is all removed,
extension SpecialInstructionsCell: UITextViewDelegate {
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
                commentAdded?(specialInstructions.text)
            }
            textView.resignFirstResponder()
            return false
        }
        return true
    }
}
