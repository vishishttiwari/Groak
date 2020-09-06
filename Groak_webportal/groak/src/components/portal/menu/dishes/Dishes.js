/**
 * This component is used for the dishes page
 */
import React, { useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import SearchBar from 'material-ui-search-bar';
import Switch from '@material-ui/core/Switch';
import { context } from '../../../../globalState/globalState';

import './css/Dishes.css';
import { fetchDishesAPI, changeAvailabilityOfDishAPI, changeDishOrderAPI } from './DishesAPICalls';
import Dish from './dish/Dish';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoDishes, DishOrder, DishesNotFound } from '../../../../catalog/Comments';
import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';
import Empty from '../../../../assets/others/empty.png';

const initialState = { dishes: [], searchField: '', changeOrder: false, loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchDishes':
            return { ...state, dishes: action.dishes, loadingSpinner: false };
        case 'setDishes':
            return { ...state, dishes: action.dishes, loadingSpinner: false };
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        case 'setChangeOrder':
            return { ...state, changeOrder: action.changeOrder };
        default:
            return initialState;
    }
}

const Dishes = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchDishes() {
            await fetchDishesAPI(globalState.restaurantPortalIdPortal, setState, enqueueSnackbar);
        }
        fetchDishes();
    }, [globalState.restaurantPortalIdPortal, enqueueSnackbar]);

    /**
     * This function is passed into the dish component which is called everytime
     * the available button is pressed
     *
     * @param {*} changedDish this is the dish for which availability is changed
     */
    const availableDishHandler = async (changedDish) => {
        await changeAvailabilityOfDishAPI(globalState.restaurantPortalIdPortal, state.dishes, setState, changedDish, enqueueSnackbar);
    };

    /**
     * This function is called to add a dish. This function is passed to the heading
     */
    function addDishHandler() {
        history.push('/dishes/addDish');
    }

    /**
     * This function is called when each dish is pressed.
     *
     * @param {*} id this is the key of the dish that is passed
     */
    function dishDetailHandler(id) {
        history.push(`/dishes/${id}`);
    }

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedDishes = arrayMove(state.dishes, oldIndex, newIndex);
            setState({ type: 'setDishes',
                dishes: updatedDishes,
            });
            await changeDishOrderAPI(globalState.restaurantPortalIdPortal, updatedDishes.map((dish) => {
                return dish.reference;
            }), enqueueSnackbar);
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
     * This function is called when order toggle is pressed
     *
     * @param {*} checked
     */
    const orderToggle = (checked) => {
        setState({ type: 'setChangeOrder', changeOrder: checked });
    };

    return (
        <div className="dishes">
            <Heading heading="Dishes" buttonName="Add Dish" onClick={addDishHandler} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    <SearchBar
                        className="search-bar"
                        value={state.searchField}
                        onChange={(newValue) => {
                            setState({ type: 'setSearchField', searchField: newValue });
                        }}
                    />
                    {state.dishes && state.dishes.length === 0 ? (
                        <>
                            <p className="text-on-background">{NoDishes}</p>
                            <div className="not-found">
                                <p className="not-found-text">{DishesNotFound}</p>
                                <img className="not-found-image" draggable="false" src={Empty} alt="No Categories" />
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-on-background">{DishOrder}</p>
                            <div className="order-change-toggle">
                                <Switch
                                    checked={state.changeOrder}
                                    size="medium"
                                    onChange={(event) => { orderToggle(event.target.checked); }}
                                    name="changeOrder"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    color="primary"
                                />
                                <p className="toggle-label">Change Order</p>
                            </div>
                        </>
                    )}
                    <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                        <div className="dish-items">
                            {state.dishes.map((dish, index) => {
                                return (isDishVisible(dish)
                                    ? (
                                        <SortableItem key={dish.id} index={index} disabled={!state.changeOrder}>
                                            <Dish
                                                dishItem={dish}
                                                availableDishHandler={availableDishHandler}
                                                clickHandler={() => { dishDetailHandler(dish.id); }}
                                            />
                                        </SortableItem>
                                    ) : null
                                );
                            })}
                        </div>
                    </SortableList>
                </>
            ) : null}
        </div>
    );
};

Dishes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Dishes));
