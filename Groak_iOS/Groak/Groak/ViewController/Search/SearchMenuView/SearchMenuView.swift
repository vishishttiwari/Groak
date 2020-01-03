//
//  SearchMenuView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/19/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This sets the actual menu view showing all the matching dishes

import Foundation
import UIKit

internal class SearchMenuView: UITableView {
    
    // Optional Closures
    internal var removeKeyboard: (() -> ())?
    internal var dishSelected: ((_ dish: Dish) -> ())?
    
    private let cellId: String = "cellId"
    private let headerId: String = "headerId"
    
    private var categories: [MenuCategory] = []
    private var searchText: String = ""
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        self.contentInset = insets
        self.register(DishCell.self, forCellReuseIdentifier: cellId)
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerId)
        self.dataSource = self
        self.delegate = self
        self.isScrollEnabled = true
        self.showsVerticalScrollIndicator = false
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        self.bounces = true
        self.separatorStyle = .none
    }
    
    internal func reloadData(categories: [MenuCategory], searchText: String) {
        self.categories = categories
        self.searchText = searchText

        reloadData()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension SearchMenuView: UITableViewDataSource, UITableViewDelegate, UIScrollViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return categories.count
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerId) as! UITableViewHeader
        header.title.text = categories[section].name
        return header
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return categories[section].dishes.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: cellId, for: indexPath) as! DishCell
        
        cell.highlightString = self.searchText
        cell.dish = categories[indexPath.section].dishes[indexPath.row]
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        dishSelected?(categories[indexPath.section].dishes[indexPath.row])
        tableView.deselectRow(at: indexPath, animated: true)
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return DimensionsCatalog.tableHeaderHeight
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        removeKeyboard?()
    }
}
