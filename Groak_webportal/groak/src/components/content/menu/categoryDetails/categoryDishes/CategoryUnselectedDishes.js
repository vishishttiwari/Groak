/**
 * This components is used to represent the unselected dishes in categories details
 */
import React from 'react';
import PropTypes from 'prop-types';
import Dish from './Dish';

const CategoryUnselectedDishes = (props) => {
    const { selectedDishes, allDishes, checkDishHandler } = props;

    return (
        <div className="category-dishes">
            <h2>Unselected Dishes:</h2>
            <div className="dishes">
                {allDishes.map((dish) => {
                    return (!selectedDishes.includes(dish.id) ? (
                        <Dish
                            key={dish.id}
                            dishItem={dish}
                            alreadyChecked={false}
                            checkDishHandler={checkDishHandler}
                            arrows={false}
                        />
                    ) : null);
                })}
            </div>
        </div>
    );
};

CategoryUnselectedDishes.propTypes = {
    selectedDishes: PropTypes.array.isRequired,
    allDishes: PropTypes.array.isRequired,
    checkDishHandler: PropTypes.func.isRequired,
};

export default React.memo(CategoryUnselectedDishes);
