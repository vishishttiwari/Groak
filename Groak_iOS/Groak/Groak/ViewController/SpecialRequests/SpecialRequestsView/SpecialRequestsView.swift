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
    // Optional Closures
    internal var dismissKeyboard: (() -> ())?
    
    internal var requests: Requests = Requests.init()
    
    private let specialRequestCellId: String = "cellId"
    
    required init() {
        super.init(frame: .zero, style: .grouped)
        
        self.backgroundColor = .white
        self.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(self.handleTap(_:))))
        
        setupViews()
    }
    
    private func setupViews() {
        self.separatorStyle = .none
        self.estimatedRowHeight = self.rowHeight
        self.rowHeight = UITableView.automaticDimension
        let insets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
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
    
    // Function called when background is tapped
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        dismissKeyboard?()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension SpecialRequestsView: UITableViewDataSource, UITableViewDelegate, UIScrollViewDelegate {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return requests.requests.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: specialRequestCellId, for: indexPath) as! SpecialRequestsCell
        
        cell.request = requests.requests[indexPath.row]
        
        return cell
    }
}