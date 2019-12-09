//
//  SpecialRequestsView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/24/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class SpecialRequestsView: UITableView {
    
    internal var requests: Requests = Requests.init()
    
    private let specialRequestCellId: String = "cellId"
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        setupViews()
    }
    
    private func setupViews() {
        self.backgroundColor = .white
        
        self.separatorStyle = .none
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: DimensionsCatalog.tableViewInsetDistance, left: 0, bottom: DimensionsCatalog.tableViewInsetDistance, right: 0)
        self.contentInset = insets
        
        self.register(SpecialRequestsCell.self, forCellReuseIdentifier: specialRequestCellId)
                
        self.dataSource = self
        self.delegate = self
        
        self.showsVerticalScrollIndicator = false
    }
    
    internal func reloadData(requests: Requests) {
        self.requests = requests

        reloadData()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension SpecialRequestsView: UITableViewDataSource, UITableViewDelegate, UIScrollViewDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return requests.requests.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: specialRequestCellId, for: indexPath) as! SpecialRequestsCell
        
        cell.request = requests.requests[indexPath.row]
        
        return cell
    }
    
    func scrollToBottom(){
        DispatchQueue.main.async {
            let indexPath = IndexPath(row: self.requests.requests.count-1, section: 0)
            self.scrollToRow(at: indexPath, at: .bottom, animated: true)
        }
    }
}
