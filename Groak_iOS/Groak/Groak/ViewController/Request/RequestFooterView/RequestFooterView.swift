//
//  RequestFooterView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/24/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class represents the special requests footer view

import Foundation
import UIKit

internal class RequestFooterView: UIView {
    
    // Optional Closures
    internal var sendRequest: ((_ request: String) -> ())?
    
    private var requestSuggestionsView: UICollectionView?
    private let requestTextInputContainer: UIView = UIView()
    private let requestTextInput: UITextView = UITextView()
    private let requestSendButton: UIButton = UIButton()
    
    private let placeholder: String! = "Anything we can help you with?"
    
    private let suggestions: [Int: [String]] =
        [0: ["💧", "Can we have some water please?"],
         1: ["🍴", "Can we get some cutlery please?"],
         2: ["🍷", "Can we get a refill on our drinks?"],
         3: ["🍽", "Can we get some extra plates?"],
         4: ["Specials?", "Could you tell me about the specials?"],
         5: ["Chef's recommendation?", "What are the chef's recommendation?"],
         6: ["Suggest spicy dishes", "Can you suggest some spicy dishes?"],
         7: ["Suggest gluten free dishes", "Can you suggest some gluten free dishes?"],
         8: ["Suggest food for nut allergies", "Can you suggest some dishes for someone with nut allergies?"]]

    internal let suggestionsHeight: CGFloat = 70
    internal let textInputHeight: CGFloat = 50
    internal let sendButtonWidth: CGFloat = 70
    internal let sendButtonHeight: CGFloat = 30
    
    private let cellId = "cellId"
    
    required init() {
        super.init(frame: .zero)
        
        setupViews()
        
        setupInitialLayout()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        layout.estimatedItemSize = UICollectionViewFlowLayout.automaticSize
        requestSuggestionsView = UICollectionView.init(frame: self.bounds, collectionViewLayout: layout)
        requestSuggestionsView!.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        requestSuggestionsView!.register(SuggestionsCell.self, forCellWithReuseIdentifier: cellId)
        requestSuggestionsView!.dataSource = self
        requestSuggestionsView!.delegate = self
        requestSuggestionsView!.backgroundColor = .clear
        requestSuggestionsView!.isScrollEnabled = true
        requestSuggestionsView!.showsHorizontalScrollIndicator = false
        requestSuggestionsView!.showsVerticalScrollIndicator = false
        requestSuggestionsView!.allowsMultipleSelection = false
        requestSuggestionsView!.bounces = true
        self.addSubview(requestSuggestionsView!)
        
        requestTextInput.text = placeholder
        requestTextInput.delegate = self
        requestTextInput.font = UIFont(name: FontCatalog.fontLevels[1], size: 15)
        requestTextInput.backgroundColor = .clear
        requestTextInput.textAlignment = .left
        requestTextInput.textColor = .lightGray
        requestTextInput.clipsToBounds = true
        requestTextInput.keyboardAppearance = .dark
        requestTextInputContainer.addSubview(requestTextInput)
        
        requestSendButton.addTarget(self, action: #selector(send), for: .touchUpInside)
        requestSendButton.setTitle("Send", for: .normal)
        requestSendButton.setTitleColor(ColorsCatalog.themeColor, for: .normal)
        requestSendButton.contentHorizontalAlignment = .right
        requestSendButton.titleLabel?.font = UIFont(name: FontCatalog.fontLevels[3], size: 20)
        requestTextInputContainer.addSubview(requestSendButton)
        
        requestTextInputContainer.layer.cornerRadius = DimensionsCatalog.cornerRadius
        requestTextInputContainer.layer.borderWidth = 1.0
        requestTextInputContainer.layer.borderColor = ColorsCatalog.shadesOfGray[5].cgColor
        self.addSubview(requestTextInputContainer)
    }
    
    private func setupInitialLayout() {
        requestSuggestionsView!.translatesAutoresizingMaskIntoConstraints = false
        requestTextInput.translatesAutoresizingMaskIntoConstraints = false
        requestSendButton.translatesAutoresizingMaskIntoConstraints = false
        requestTextInputContainer.translatesAutoresizingMaskIntoConstraints = false
        
        requestSuggestionsView?.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        requestSuggestionsView?.heightAnchor.constraint(equalToConstant: suggestionsHeight).isActive = true
        requestSuggestionsView?.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        requestSuggestionsView?.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        
        requestTextInput.topAnchor.constraint(equalTo: requestTextInputContainer.topAnchor).isActive = true
        requestTextInput.leftAnchor.constraint(equalTo: requestTextInputContainer.leftAnchor).isActive = true
        requestTextInput.rightAnchor.constraint(equalTo: requestSendButton.leftAnchor).isActive = true
        requestTextInput.bottomAnchor.constraint(equalTo: requestTextInputContainer.bottomAnchor).isActive = true
        
        requestSendButton.centerYAnchor.constraint(equalTo: requestTextInput.centerYAnchor).isActive = true
        requestSendButton.widthAnchor.constraint(equalToConstant: sendButtonWidth).isActive = true
        requestSendButton.rightAnchor.constraint(equalTo: requestTextInputContainer.rightAnchor, constant: -DimensionsCatalog.distanceBetweenElements).isActive = true
        
        requestTextInputContainer.topAnchor.constraint(equalTo: requestSuggestionsView!.bottomAnchor).isActive = true
        requestTextInputContainer.heightAnchor.constraint(equalToConstant: textInputHeight).isActive = true
        requestTextInputContainer.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        requestTextInputContainer.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceBetweenElements).isActive = true
        requestTextInputContainer.bottomAnchor.constraint(equalTo: self.bottomAnchor, constant: -DimensionsCatalog.viewControllerFooterDimensions.distanceFromBottom).isActive = true
    }
    
    internal func resignKeyboard() {
        requestTextInput.resignFirstResponder()
    }
    
    @objc func send() {
        if (requestTextInput.text.count != 0 && requestTextInput.textColor == UIColor.black) {
            sendRequest?(requestTextInput.text)
            requestTextInput.text = nil
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension RequestFooterView: UICollectionViewDataSource, UICollectionViewDelegate, UIScrollViewDelegate {
    
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return suggestions.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: cellId, for: indexPath) as! SuggestionsCell
        
        cell.suggestion.text = suggestions[indexPath.row]?[0]
        
        return cell
    }
    
    // When it is selected the uitextview is changed to the value of the item that was selected
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        requestTextInput.text = suggestions[indexPath.row]?[1]
        requestTextInput.textColor = UIColor.black
    }
}


// This is used to set a placeholder in text view.
// Text view does not have any placeholder so all this drama has to be done.
// When the view is empty then it is replaced with gray text.
// When the user is writing the if there is a gray text then it is all removed,
extension RequestFooterView: UITextViewDelegate {
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
            textView.resignFirstResponder()
            return false
        }
        return true
    }
}
