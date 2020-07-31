/**
 * This component is used for the dishes page
 */
import React, { useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import { context } from '../../../../globalState/globalState';

import './css/Dishes.css';
import { fetchDishesAPI, changeAvailabilityOfDishAPI, changeDishOrderAPI } from './DishesAPICalls';
import Dish from './dish/Dish';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoDishes } from '../../../../catalog/Comments';
import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';

const initialState = { dishes: [], loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchDishes':
            return { dishes: action.dishes, loadingSpinner: false };
        case 'setDishes':
            return { dishes: action.dishes, loadingSpinner: false };
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
            await fetchDishesAPI(globalState.restaurantId, setState, enqueueSnackbar);
        }
        fetchDishes();
    }, [globalState.restaurantId, enqueueSnackbar]);

    /**
     * This function is passed into the dish component which is called everytime
     * the available button is pressed
     *
     * @param {*} changedDish this is the dish for which availability is changed
     */
    const availableDishHandler = async (changedDish) => {
        await changeAvailabilityOfDishAPI(globalState.restaurantId, state.dishes, setState, changedDish, enqueueSnackbar);
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
            await changeDishOrderAPI(globalState.restaurantId, updatedDishes.map((dish) => {
                return dish.reference;
            }), enqueueSnackbar);
        }
    };

    return (
        <div className="dishes">
            <Heading heading="Dishes" buttonName="Add Dish" onClick={addDishHandler} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                    <div className="dish-items">
                        {state.dishes && state.dishes.length === 0 ? <p className="text-on-background">{NoDishes}</p> : null}
                        {state.dishes.map((dish, index) => {
                            return (
                                <SortableItem key={dish.id} index={index}>
                                    <Dish
                                        dishItem={dish}
                                        availableDishHandler={availableDishHandler}
                                        clickHandler={() => { dishDetailHandler(dish.id); }}
                                    />
                                </SortableItem>
                            );
                        })}
                    </div>
                </SortableList>
            ) : null}
        </div>
    );
};

Dishes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Dishes));
