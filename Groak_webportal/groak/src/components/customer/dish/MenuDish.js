/**
 * This class is used for main screen in dish screen
 */
import React, { useEffect, useReducer, createRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MenuDishHeader from './MenuDishHeader';
import { fetchDishAPI } from './MenuDishAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import './css/MenuDish.css';
import MenuDishFooter from './MenuDishFooter';
import CustomerTopic from '../ui/topic/CustomerTopic';
import CustomerInfo from '../ui/info/CustomerInfo';
import MenuDishInfo from './MenuDishInfo';
import MenuDishContent from './MenuDishContent';
import { context } from '../../../globalState/globalState';
import { timeoutValueForCustomer } from '../../../catalog/TimesDates';

const initialState = { dish: {}, loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchDish':
            return { ...state, dish: action.dish, loadingSpinner: false };
        default:
            return initialState;
    }
}

const MenuDish = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const top = createRef(null);

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
    }, [top]);

    useEffect(() => {
        if (!globalState.scannedCustomer || !globalState.orderAllowedCustomer) {
            history.replace('/');
        }

        async function fetchDish() {
            await fetchDishAPI(match.params.restaurantid, match.params.dishid, setState);
        }
        fetchDish();

        setTimeout(() => {
            history.replace('/');
        }, timeoutValueForCustomer);
    }, [globalState.orderAllowedCustomer, globalState.scannedCustomer, history, match.params.dishid, match.params.restaurantid]);

    return (
        <div className="customer dish">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {
                !state.loadingSpinner ? (
                    <>
                        <MenuDishHeader dishName={state.dish.name} dishPrice={state.dish.price} />
                        <div className="content">
                            <img className="dish-image" src={state.dish.image} alt={state.dish.name || 'Dish Image'} />
                            <MenuDishInfo vegetarian={state.dish.restrictions.vegetarian} vegan={state.dish.restrictions.vegan} glutenFree={state.dish.restrictions.glutenFree} kosher={state.dish.restrictions.kosher} />
                            <MenuDishContent calories={state.dish.nutrition.calories} fats={state.dish.nutrition.fats} protein={state.dish.nutrition.protein} carbs={state.dish.nutrition.carbs} />
                            {state.dish.description
                                ? (
                                    <>
                                        <CustomerTopic header="Description" />
                                        <CustomerInfo info={state.dish.description} />
                                    </>
                                )
                                : null}
                        </div>
                        <MenuDishFooter restaurantId={match.params.restaurantid} dishId={match.params.dishid} />
                    </>
                ) : null
            }
        </div>
    );
};

MenuDish.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(MenuDish));
