//
//  MenuView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//
//  This class is used to represent the menu view in UITableView form

import Foundation
import UIKit

internal class MenuView: UITableView {
    
    // Optional Closures
    internal var menuSectionChanged: ((_ section: Int) -> ())?
    internal var dishSelected: ((_ dish: Dish) -> ())?
    
    private let cellId: String = "cellId"
    private let headerId: String = "headerId"
    private var defaulCells: [String] = ["Special Requests"]
    
    private var currentSection: Int = 0
    private var sectionChangedFromHeader: Bool = false
    
    private var categories: [MenuCategory] = []
    
    private var viewController: UIViewController?
    
    required init(viewController: UIViewController) {
        super.init(frame: .zero, style: .grouped)
        
        self.viewController = viewController
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.separatorStyle = .singleLine
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        self.contentInset = insets
        
        self.register(DishCell.self, forCellReuseIdentifier: cellId)
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerId)
        
        self.dataSource = self
        self.delegate = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    // When the user presses a menu category in the header...this function is called to scroll to the correct section
    internal func sectionChanged(section: Int) {
        let indexPath = IndexPath.init(row: 0, section: section)
        sectionChangedFromHeader = true
        self.scrollToRow(at: indexPath, at: .top, animated: true)
    }
    
    // This function is called when the menu is downloaded
    internal func reloadData(categories: [MenuCategory]) {
        self.categories = categories

        reloadData()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension MenuView: UITableViewDataSource, UITableViewDelegate, UIScrollViewDelegate {
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
        
        cell.dish = categories[indexPath.section].dishes[indexPath.row]
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if categories[indexPath.section].dishes[indexPath.row].available {
            dishSelected?(categories[indexPath.section].dishes[indexPath.row])
        } else {
            Catalog.alert(vc: self.viewController, title: nil, message: "This dish is currently unavailable")
        }
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return DimensionsCatalog.tableHeaderHeight
    }

    // The variable is used to make sure that the scrolling is actually done by the user or by selecting
    // something in the header
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let section = self.indexPath(for: self.visibleCells[0])!.section
        if (section != currentSection) {
            currentSection = section
            if !sectionChangedFromHeader {
                menuSectionChanged?(currentSection)
            }
        }
    }

    func scrollViewDidEndScrollingAnimation(_ scrollView: UIScrollView) {
        sectionChangedFromHeader = false
    }
}
