//
//  IngredientsView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/20/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class IngredientsView: UITableView {
    
    // Optional Closures
    internal var ingredientWebView: ((_ ingredientName: String) -> ())?
    
    private let cellId = "cellId"
    
    private var dishIngredients: [String] = []
    
    required init(dishIngredients: [String]) {
        super.init(frame: .zero, style: .grouped)
        
        self.dishIngredients = dishIngredients
        
        setupViews()
    }
    
    private func setupViews() {
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        
        self.register(UITableViewCellWithArrow.self, forCellReuseIdentifier: cellId)
        self.delegate = self
        self.dataSource = self
        showsVerticalScrollIndicator = false
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension IngredientsView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        return nil
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 0
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return dishIngredients.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: cellId, for: indexPath) as! UITableViewCellWithArrow
        
        cell.title.text = dishIngredients[indexPath.row]
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        ingredientWebView?(dishIngredients[indexPath.row])
        tableView.deselectRow(at: indexPath, animated: true)
    }
}
