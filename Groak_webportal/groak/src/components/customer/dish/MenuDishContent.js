import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import CustomerTopic from '../ui/customerTopic/CustomerTopic';

const MenuDishContent = (props) => {
    const { calories, fats, protein, carbs } = props;

    const showContent = () => {
        if (calories && calories > 0) {
            return true;
        }
        if (fats && fats > 0) {
            return true;
        }
        if (protein && protein > 0) {
            return true;
        }
        if (carbs && carbs > 0) {
            return true;
        }
        return false;
    };

    return (
        <div className="dish-content">
            {showContent() ? (
                <>
                    <CustomerTopic header="Content" />
                    <div className="dish-content-content">
                        {calories !== -1
                            ? (
                                <div className="dish-content-content-category">
                                    <b style={{ margin: '0px' }}>Calories</b>
                                    <p style={{ margin: '0px' }}>{`: ${calories.toFixed(0)}kCal`}</p>
                                </div>
                            ) : null}
                        {fats !== -1
                            ? (
                                <div className="dish-content-content-category">
                                    <b style={{ margin: '0px' }}>Fats</b>
                                    <p style={{ margin: '0px' }}>{`: ${fats.toFixed(0)}g/100g`}</p>
                                </div>
                            ) : null}
                        {protein !== -1
                            ? (
                                <div className="dish-content-content-category">
                                    <b style={{ margin: '0px' }}>Protein</b>
                                    <p style={{ margin: '0px' }}>{`: ${protein.toFixed(0)}g/100g`}</p>
                                </div>
                            ) : null}
                        {carbs !== -1
                            ? (
                                <div className="dish-content-content-category">
                                    <b style={{ margin: '0px' }}>Carbs</b>
                                    <p style={{ margin: '0px' }}>{`: ${carbs.toFixed(0)}g/100g`}</p>
                                </div>
                            ) : null}
                    </div>
                </>
            ) : null}

        </div>
    );
};

MenuDishContent.propTypes = {
    calories: PropTypes.number.isRequired,
    fats: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
};

export default withRouter(React.memo(MenuDishContent));
