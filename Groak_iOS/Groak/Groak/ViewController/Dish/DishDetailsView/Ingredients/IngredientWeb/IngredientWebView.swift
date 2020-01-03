//
//  IngredientWebView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//
// The webview which calls google to show the data

import Foundation
import UIKit

internal class IngredientWebView: UIWebView {
    
    required init(ingredientName: String) {
        super.init(frame: .zero)
        
        loadRequest(URLRequest.init(url: URL(string: "https://www.google.com/search?q=\(ingredientName.replacingOccurrences(of: " ", with: "+"))+%22food+ingredient%22")!))
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
