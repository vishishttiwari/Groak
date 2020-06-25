//
//  CovidViewController.swift
//  Groak
//
//  Created by Vishisht Tiwari on 6/21/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CovidViewController: UIViewController {
    private let header: CovidHeaderView = CovidHeaderView.init()
    private var covidView: CovidView?

    required init(restaurant: Restaurant) {
        super.init(nibName: nil, bundle: nil)

        self.view.backgroundColor = ColorsCatalog.headerGrayShade
        
        covidView = CovidView.init(restaurant: restaurant)

        setupHeader()
        setupCovidView()
    }
    
    private func setupHeader() {
        self.view.addSubview(header)
        
        header.dismiss = { () -> () in
            self.view.coverHorizontalDismiss()
            self.dismiss(animated: false, completion: nil)
        }
        
        header.translatesAutoresizingMaskIntoConstraints = false
        header.topAnchor.constraint(equalTo: self.view.topAnchor).isActive = true
        header.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        header.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        header.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.heightNormal).isActive = true
    }
    
    private func setupCovidView() {
        self.view.addSubview(covidView!)
        
        covidView?.translatesAutoresizingMaskIntoConstraints = false
        covidView?.topAnchor.constraint(equalTo: header.bottomAnchor).isActive = true
        covidView?.leftAnchor.constraint(equalTo: self.view.leftAnchor).isActive = true
        covidView?.rightAnchor.constraint(equalTo: self.view.rightAnchor).isActive = true
        covidView?.bottomAnchor.constraint(equalTo: self.view.bottomAnchor).isActive = true
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
