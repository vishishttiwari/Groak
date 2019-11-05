/**
 * This components is used to represent the selected dishes in categories details
 */
import React from 'react';
import PropTypes from 'prop-types';
import Dish from './Dish';

import { CategoryDishesOrder } from '../../../../../catalog/Comments';

const CategorySelectedDishes = (props) => {
    const { selectedDishes, allDishes, checkDishHandler, moveDishPrior, moveDishNext, updateDishesInCategory } = props;

    /**
     * This function gets the whole dish item from the dish id.
     * If lets say the dish id was not found then it deletes the
     * dish in this category from the backend.
     *
     * @param {*} id of the dish for which dish item needs to be found
     */
    function getDish(id) {
        let dishItem = null;
        allDishes.forEach((dish) => {
            if (dish.id === id) {
                dishItem = dish;
            }
        });
        if (dishItem == null) {
            updateDishesInCategory(id);
        }
        return dishItem;
    }

    return (
        <div className="category-dishes">
            <h2>Selected Dishes:</h2>
            {selectedDishes && selectedDishes.length !== 0 ? <p>{CategoryDishesOrder}</p> : null}
            <div className="dishes">
                {selectedDishes.map((dish, index) => {
                    return (
                        <Dish
                            key={dish}
                            dishItem={getDish(dish)}
                            index={index}
                            alreadyChecked
                            checkDishHandler={checkDishHandler}
                            moveDishPrior={moveDishPrior}
                            moveDishNext={moveDishNext}
                            arrows
                        />
                    );
                })}
            </div>
        </div>
    );
};

CategorySelectedDishes.propTypes = {
    selectedDishes: PropTypes.array.isRequired,
    allDishes: PropTypes.array.isRequired,
    checkDishHandler: PropTypes.func.isRequired,
    moveDishPrior: PropTypes.func.isRequired,
    moveDishNext: PropTypes.func.isRequired,
    updateDishesInCategory: PropTypes.func.isRequired,
};

export default React.memo(CategorySelectedDishes);
