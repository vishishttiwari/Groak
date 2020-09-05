import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import CustomerTopic from '../ui/customerTopic/CustomerTopic';
import CustomerVegSymbol from '../ui/customerVegSymbol/CustomerVegSymbol';

const MenuDishInfo = (props) => {
    const { vegetarian, vegan, glutenFree, kosher } = props;

    const showInfo = () => {
        if (vegetarian && vegetarian !== 'Not Sure') {
            return true;
        }
        if (vegan && vegan !== 'Not Sure') {
            return true;
        }
        if (glutenFree && glutenFree !== 'Not Sure') {
            return true;
        }
        if (kosher && kosher !== 'Not Sure') {
            return true;
        }
        return false;
    };

    return (
        <div className="dish-info">
            {showInfo() ? (
                <>
                    <CustomerTopic header="Info" />
                    <div className="dish-info-info">
                        {vegetarian === 'Yes' && vegan !== 'Yes' ? (
                            <div className="dish-info-info-category">
                                <CustomerVegSymbol symbol="V" color="green" />
                                Vegetarian
                            </div>
                        ) : null}
                        {vegan === 'Yes' ? (
                            <div className="dish-info-info-category">
                                <CustomerVegSymbol symbol="VV" color="green" />
                                Vegan
                            </div>
                        ) : null}
                        {vegetarian === 'No' ? (
                            <div className="dish-info-info-category">
                                <CustomerVegSymbol symbol="NV" />
                                Non Vegetarian
                            </div>
                        ) : null}
                        {glutenFree === 'Yes' ? (
                            <div className="dish-info-info-category">
                                <CustomerVegSymbol symbol="GF" />
                                Gluten Free
                            </div>
                        ) : null}
                        {kosher === 'Yes' ? (
                            <div className="dish-info-info-category">
                                <CustomerVegSymbol symbol="K" />
                                Kosher
                            </div>
                        ) : null}
                    </div>
                </>
            ) : null}
        </div>
    );
};

MenuDishInfo.propTypes = {
    vegetarian: PropTypes.string.isRequired,
    vegan: PropTypes.string.isRequired,
    glutenFree: PropTypes.string.isRequired,
    kosher: PropTypes.string.isRequired,
};

export default withRouter(React.memo(MenuDishInfo));
