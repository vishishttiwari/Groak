//
//  Menu.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/8/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class MenuViewController: UIViewController {
    
    init() {
        super.init(nibName: nil, bundle: nil)
        
        self.view.backgroundColor = .red
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
