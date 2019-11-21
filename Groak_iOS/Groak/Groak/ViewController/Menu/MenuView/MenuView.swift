//
//  MenuView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class MenuView: UITableView {
    
    // Optional Closures
    internal var menuSectionChanged: ((_ section: Int) -> ())?
    internal var dishChosen: ((_ dish: Dish) -> ())?
    
    private let specialRequestCellId: String = "specialRequestCellId"
    private let cellId: String = "cellId"
    private let headerId: String = "headerId"
    private var defaulCells: [String] = ["Special Requests"]
    
    private var currentSection: Int = 0
    private var sectionChangedFromHeader: Bool = false
    
    private var categories: [MenuCategory] = []
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.separatorStyle = .none
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        self.contentInset = insets
        
        self.register(DishCell.self, forCellReuseIdentifier: cellId)
        self.register(UITableViewCellWithArrow.self, forCellReuseIdentifier: specialRequestCellId)
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerId)
        
        self.dataSource = self
        self.delegate = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    internal func sectionChanged(section: Int) {
        let indexPath = IndexPath.init(row: 0, section: section + 1)
        sectionChangedFromHeader = true
        self.scrollToRow(at: indexPath, at: .top, animated: true)
    }
    
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
        return categories.count + 1
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if (section != 0) {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerId) as! UITableViewHeader
            header.title.text = categories[section - 1].name
            return header
        } else {
            return nil
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if (section == 0) {
            return defaulCells.count
        } else {
            return categories[section - 1].dishes.count
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: specialRequestCellId, for: indexPath) as! UITableViewCellWithArrow
            
            cell.title.text = defaulCells[indexPath.row]
            
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: cellId, for: indexPath) as! DishCell
            
            cell.dish = categories[indexPath.section - 1].dishes[indexPath.row]
            
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if (indexPath.section != 0) {
            dishChosen?(categories[indexPath.section - 1].dishes[indexPath.row])
        }
    }

    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if (section == 0) {
            return 0
        } else {
            return DimensionsCatalog.tableHeaderHeight
        }
    }

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
