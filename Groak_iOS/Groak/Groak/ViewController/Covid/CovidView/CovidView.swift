//
//  CovidView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 6/21/20.
//  Copyright © 2020 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class CovidView: UITableView {
    
    private let headerCellId = "headerCellId"
    private let occupancyCellId = "occupancyCellId"
    private let weekCellId = "weekCellId"
    private let guidelinesCellId = "guidelinesCellId"
    private let messageCellId = "messageCellId"
    
    private let totalSections = 4
    
    private var restaurant: Restaurant?
    
    required init(restaurant: Restaurant) {
        super.init(frame: .zero, style: .grouped)
        
        self.restaurant = restaurant
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        self.separatorStyle = .singleLine
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets
        
        self.register(UITableViewHeader.self, forHeaderFooterViewReuseIdentifier: headerCellId)
        self.register(TextCovidCell.self, forCellReuseIdentifier: occupancyCellId)
        self.register(WeekCovidCell.self, forCellReuseIdentifier: weekCellId)
        self.register(TextCovidCell.self, forCellReuseIdentifier: guidelinesCellId)
        self.register(TextCovidCell.self, forCellReuseIdentifier: messageCellId)
        
        self.delegate = self
        self.dataSource = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension CovidView: UITableViewDataSource, UITableViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return totalSections
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if section == 0 {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Occupancy"
            header.subTitle.text = "Occupancy is estimated using tables occupied"
            return header
        } else if section == 1 {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Maximum Occupancy last week"
            header.subTitle.text = "Occupancy is estimated using tables occupied"
            return header
        } else if section == 2 {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Covid standards in your area"
            return header
        } else if section == 3 {
            let header = tableView.dequeueReusableHeaderFooterView(withIdentifier: headerCellId) as! UITableViewHeader
            header.title.text = "Message from restaurant"
            return header
        } else {
            return nil
        }
    }
    
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if section == 0 {
           return DimensionsCatalog.tableHeaderWithSubtitleHeight
        } else if section == 1 {
           return DimensionsCatalog.tableHeaderWithSubtitleHeight
        } else if section == 2 {
           return DimensionsCatalog.tableHeaderHeight
        } else if section == 3 {
           return DimensionsCatalog.tableHeaderHeight
        } else {
           return 0
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if (indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: occupancyCellId, for: indexPath) as! TextCovidCell
            
            if let restaurant = restaurant {
                cell.label.text = "The occupancy before you arrived \(restaurant.name) was \(Int(100*Float(restaurant.currentOccupancy)/Float(restaurant.maximumOccupancy)))%"
                
                cell.label.textAlignment = .center
            }
            
            return cell
        } else if (indexPath.section == 1) {
            let cell = tableView.dequeueReusableCell(withIdentifier: weekCellId, for: indexPath) as! WeekCovidCell
            
            cell.restaurant = restaurant!
            
            return cell
        } else if (indexPath.section == 2) {
            let cell = tableView.dequeueReusableCell(withIdentifier: guidelinesCellId, for: indexPath) as! TextCovidCell
            
            cell.label.text = restaurant?.covidGuidelines
            
            return cell
        } else if (indexPath.section == 3) {
            let cell = tableView.dequeueReusableCell(withIdentifier: messageCellId, for: indexPath) as! TextCovidCell
            
            if let message = restaurant?.covidMessage {
                cell.label.text = "\"\(message)\"\n\n-\(restaurant!.name)"
            }
            
            return cell
        }
        
        return UITableViewCell.init()
    }
}
