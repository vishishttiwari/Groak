/**
 * This components is used to represent the selected dishes in qrcodes details
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import Dish from './Dish';

import { CategoryDishesOrder } from '../../../../../catalog/Comments';
import SortableList from '../../../../dnd/SortableList';
import SortableItem from '../../../../dnd/SortableItem';

const CategorySelectedDishes = (props) => {
    const { history, selectedDishesPath, allDishesMap, checkDishHandler, changeDishPositionHandler } = props;

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            changeDishPositionHandler(arrayMove(selectedDishesPath, oldIndex, newIndex));
        }
    };

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
            <h2>Selected Dishes:</h2>
            {selectedDishesPath && selectedDishesPath.length !== 0 ? <p>{CategoryDishesOrder}</p> : null}
            <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                <div className="dishes">
                    {selectedDishesPath.map((dishPath, index) => {
                        const dish = allDishesMap.get(dishPath);
                        return (dish
                            ? (
                                <SortableItem key={dish.id} index={index}>
                                    <Dish
                                        dishItem={dish}
                                        alreadyChecked
                                        checkDishHandler={checkDishHandler}
                                        clickHandler={() => { dishDetailHandler(dish.id); }}
                                    />
                                </SortableItem>
                            ) : null
                        );
                    })}
                </div>
            </SortableList>
        </div>
    );
};

CategorySelectedDishes.propTypes = {
    history: PropTypes.object.isRequired,
    selectedDishesPath: PropTypes.array.isRequired,
    allDishesMap: PropTypes.instanceOf(Map).isRequired,
    checkDishHandler: PropTypes.func.isRequired,
    changeDishPositionHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CategorySelectedDishes));
