/**
 * This class is used dish restrictions like vegetarian at the bottom of menu
 */
import React from 'react';

import CustomerVegSymbol from '../ui/vegSymbol/CustomerVegSymbol';

const DishRestrictionsIndex = () => {
    return (
        <div className="dish-restrictions">
            <div className="dish-restrictions-row">
                <div className="dish-restriction">
                    <CustomerVegSymbol symbol="V" color="green" />
                    Vegetarian
                </div>
                <div className="dish-restriction">
                    <CustomerVegSymbol symbol="VV" color="green" />
                    Vegan
                </div>
            </div>
            <div className="dish-restrictions-row">
                <div className="dish-restriction">
                    <CustomerVegSymbol symbol="NV" color="maroon" />
                    Non Vegetarian
                </div>
                <div className="dish-restriction">
                    <CustomerVegSymbol symbol="SF" color="blue" />
                    Sea Food
                </div>
            </div>
            <div className="dish-restrictions-row">
                <div className="dish-restriction">
                    <CustomerVegSymbol symbol="GF" />
                    Gluten Free
                </div>
                <div className="dish-restriction">
                    <CustomerVegSymbol symbol="K" />
                    Kosher
                </div>
            </div>
        </div>
    );
};

export default React.memo(DishRestrictionsIndex);
