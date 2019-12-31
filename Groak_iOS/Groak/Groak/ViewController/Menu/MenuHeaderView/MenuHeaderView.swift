//
//  MenuHeaderView.swift
//  Groak
//
//  Created by Vishisht Tiwari on 11/18/19.
//  Copyright © 2019 Groak. All rights reserved.
//

import Foundation
import UIKit

internal class MenuHeaderView: UIView {
    
    // Optional Closures
    internal var menuSectionChanged: ((_ section: Int) -> ())?
    internal var dismiss: (() -> ())?
    internal var find: (() -> ())?
    
    private let backButton: UIButton = UIButton()
    private let searchButton: UIButton = UIButton()
    private let restaurantTitle: UILabel = UILabel()
    private var foodCategories: UICollectionView?
    
    private let cellId = "cellId"
    
    private var categories: [MenuCategory] = []
    private var foodCategorySelected: IndexPath = IndexPath.init(row: 0, section: 0)
    
    required init(restaurant: Restaurant) {
        super.init(frame: .zero)
        
        setupViews(restaurant: restaurant)
        
        setupInitialLayout()
    }
    
    private func setupViews(restaurant: Restaurant) {
        self.backgroundColor = ColorsCatalog.headerGrayShade
        
        backButton.addTarget(self, action: #selector(back), for: .touchUpInside)
        backButton.setImage(#imageLiteral(resourceName: "back"), for: .normal)
        self.addSubview(backButton)
        
        searchButton.addTarget(self, action: #selector(search), for: .touchUpInside)
        searchButton.setImage(#imageLiteral(resourceName: "search"), for: .normal)
        searchButton.isHidden = true
        self.addSubview(searchButton)
        
        restaurantTitle.viewControllerHeaderTitle(title: restaurant.name)
        self.addSubview(restaurantTitle)
        
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.minimumLineSpacing = 0
        layout.estimatedItemSize = UICollectionViewFlowLayout.automaticSize
        foodCategories = UICollectionView.init(frame: self.bounds, collectionViewLayout: layout)
        foodCategories!.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        foodCategories!.register(CategoryCell.self, forCellWithReuseIdentifier: cellId)
        foodCategories!.dataSource = self
        foodCategories!.delegate = self
        foodCategories!.backgroundColor = .clear
        foodCategories!.isScrollEnabled = true
        foodCategories!.showsHorizontalScrollIndicator = false
        foodCategories!.showsVerticalScrollIndicator = false
        foodCategories!.allowsMultipleSelection = false
        foodCategories!.bounces = true
        self.addSubview(foodCategories!)
    }
    
    private func setupInitialLayout() {
        backButton.translatesAutoresizingMaskIntoConstraints = false
        searchButton.translatesAutoresizingMaskIntoConstraints = false
        restaurantTitle.translatesAutoresizingMaskIntoConstraints = false
        foodCategories!.translatesAutoresizingMaskIntoConstraints = false
        
        restaurantTitle.topAnchor.constraint(equalTo: self.topAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceFromTop).isActive = true
        restaurantTitle.leftAnchor.constraint(equalTo: backButton.rightAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        restaurantTitle.rightAnchor.constraint(equalTo: searchButton.leftAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        restaurantTitle.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        backButton.centerYAnchor.constraint(equalTo: restaurantTitle.centerYAnchor).isActive = true
        backButton.leftAnchor.constraint(equalTo: self.leftAnchor, constant: DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        backButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        backButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        searchButton.centerYAnchor.constraint(equalTo: restaurantTitle.centerYAnchor).isActive = true
        searchButton.rightAnchor.constraint(equalTo: self.rightAnchor, constant: -DimensionsCatalog.viewControllerHeaderDimensions.distanceBetweenElements).isActive = true
        searchButton.widthAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        searchButton.heightAnchor.constraint(equalToConstant: DimensionsCatalog.viewControllerHeaderDimensions.titleSize).isActive = true
        
        foodCategories!.topAnchor.constraint(equalTo: restaurantTitle.bottomAnchor).isActive = true
        foodCategories!.leftAnchor.constraint(equalTo: self.leftAnchor).isActive = true
        foodCategories!.rightAnchor.constraint(equalTo: self.rightAnchor).isActive = true
        foodCategories!.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
    }
    
    internal func sectionChanged(section: Int) {
        if (section <= 0) {
            return
        }
        
        let indexPath = IndexPath.init(row: section - 1, section: 0)
        foodCategorySelected = indexPath
        self.foodCategories?.scrollToItem(at: indexPath, at: .centeredHorizontally, animated: true)
    }
    
    @objc func back() {
        dismiss?()
    }
    
    @objc func search() {
        find?()
    }
    
    internal func reloadData(categories: [MenuCategory]) {
        self.categories = categories
        searchButton.isHidden = false
        DispatchQueue.main.async {
            self.foodCategories?.reloadData()
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension MenuHeaderView: UICollectionViewDataSource, UICollectionViewDelegate, UIScrollViewDelegate {
    
    func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return categories.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: cellId, for: indexPath) as! CategoryCell
        
        cell.category.text = categories[indexPath.row].name
        
        if indexPath.row == 0 {
            cell.container.backgroundColor = ColorsCatalog.themeColor
            cell.category.textColor = .white
        }
        
        return cell
    }
    
    func scrollViewWillEndDragging(_ scrollView: UIScrollView, withVelocity velocity: CGPoint, targetContentOffset: UnsafeMutablePointer<CGPoint>) {
        let layout = foodCategories!.collectionViewLayout as! UICollectionViewFlowLayout
        let cellWidthIncludingSpacing = layout.itemSize.width + layout.minimumLineSpacing
        
        var offset = targetContentOffset.pointee
        let index = (offset.x + scrollView.contentInset.left)/cellWidthIncludingSpacing
        let roundedIndex = round(index)
        
        offset = CGPoint.init(x: roundedIndex * cellWidthIncludingSpacing - scrollView.contentInset.left, y: scrollView.contentInset.top)
        
        targetContentOffset.pointee = offset
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let cell = collectionView.cellForItem(at: indexPath) as? CategoryCell

        cell?.container.backgroundColor = ColorsCatalog.themeColor
        cell?.category.textColor = .white
        menuSectionChanged?(indexPath.row)

        collectionView.scrollToItem(at: indexPath, at: .centeredHorizontally, animated: true)

        foodCategorySelected = indexPath
    }

    func collectionView(_ collectionView: UICollectionView, didDeselectItemAt indexPath: IndexPath) {

        let cell = collectionView.cellForItem(at: indexPath) as? CategoryCell

        cell?.container.backgroundColor = ColorsCatalog.headerGrayShade
        cell?.category.textColor = .black
    }

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        for cells in foodCategories!.visibleCells {
            let cell = cells as! CategoryCell
            let indexPath = foodCategories!.indexPath(for: cell)
            if (indexPath?.row != foodCategorySelected.row) {
                cell.container.backgroundColor = ColorsCatalog.headerGrayShade
                cell.category.textColor = .black
            }
            else {
                cell.container.backgroundColor = ColorsCatalog.themeColor
                cell.category.textColor = ColorsCatalog.headerGrayShade
            }
        }
    }
}
