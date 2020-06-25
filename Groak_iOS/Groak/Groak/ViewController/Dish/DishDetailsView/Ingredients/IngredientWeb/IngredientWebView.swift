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
import WebKit

internal class IngredientWebView: WKWebView {
    
    required init(ingredientName: String) {
        let config = WKWebViewConfiguration()
        super.init(frame: .zero, configuration: config)
        
        load(URLRequest.init(url: URL(string: "https://www.google.com/search?q=\(ingredientName.replacingOccurrences(of: " ", with: "+"))")!))
    }
    
    override init(frame: CGRect, configuration: WKWebViewConfiguration) {
        super.init(frame: frame, configuration: configuration)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
