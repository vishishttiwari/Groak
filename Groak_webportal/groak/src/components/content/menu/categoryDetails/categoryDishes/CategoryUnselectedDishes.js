/**
 * This components is used to represent the unselected dishes in categories details
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Dish from './Dish';

const CategoryUnselectedDishes = (props) => {
    const { history, selectedDishesPath, allDishes, checkDishHandler } = props;

    /**
     * This function is called when dish is pressed
     *
     * @param {*} id
     */
    function dishDetailHandler(id) {
        history.push(`/dishes/${id}`);
    }

    return (
        <div className="category-dishes">
            <h2>Unselected Dishes:</h2>
            <div className="dishes">
                {allDishes.map((dish) => {
                    return (!selectedDishesPath.includes(dish.reference.path) ? (
                        <Dish
                            key={dish.id}
                            dishItem={dish}
                            alreadyChecked={false}
                            checkDishHandler={checkDishHandler}
                            clickHandler={() => { dishDetailHandler(dish.id); }}
                        />
                    ) : null);
                })}
            </div>
        </div>
    );
};

CategoryUnselectedDishes.propTypes = {
    history: PropTypes.object.isRequired,
    selectedDishesPath: PropTypes.array.isRequired,
    allDishes: PropTypes.array.isRequired,
    checkDishHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CategoryUnselectedDishes));
