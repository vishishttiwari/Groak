/**
 * This components is used to represent the selected dishes in qrcodes details
 */
import React, { useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import SearchBar from 'material-ui-search-bar';
import Dish from './Dish';

import { CategoryDishesOrder } from '../../../../../catalog/Comments';
import SortableList from '../../../../dnd/SortableList';
import SortableItem from '../../../../dnd/SortableItem';

const initialState = {
    searchField: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        default:
            return initialState;
    }
}

const CategorySelectedDishes = (props) => {
    const { history, selectedDishesPath, allDishesMap, checkDishHandler, changeDishPositionHandler } = props;
    const [state, setState] = useReducer(reducer, initialState);

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
     * This function decides if dish is visble after writing something up in the search bar
     *
     * @param {*} dish
     */
    const isDishVisible = (dish) => {
        if (!dish) { return false; }
        if (state.searchField.length <= 0) { return true; }
        if (dish.name && dish.name.toLowerCase().startsWith(state.searchField.toLowerCase())) { return true; }
        if (dish.name) {
            const dishName = dish.name.split(' ');
            for (let i = 0; i < dishName.length; i += 1) {
                if (dishName[i] && dishName[i].toLowerCase().startsWith(state.searchField.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
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
            <SearchBar
                className="search-bar"
                value={state.searchField}
                onChange={(newValue) => {
                    setState({ type: 'setSearchField', searchField: newValue });
                }}
            />
            <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                <div className="dishes">
                    {selectedDishesPath.map((dishPath, index) => {
                        const dish = allDishesMap.get(dishPath);
                        return (isDishVisible(dish)
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
