import React, { useEffect, useReducer, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import MenuDishHeader from './MenuDishHeader';
import { fetchDishAPI } from './MenuDishAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import './css/MenuDish.css';
import MenuDishFooter from './MenuDishFooter';
import CustomerTopic from '../ui/customerTopic/CustomerTopic';
import CustomerInfo from '../ui/customerInfo/CustomerInfo';
import MenuDishInfo from './MenuDishInfo';
import MenuDishContent from './MenuDishContent';

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
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const top = createRef(null);

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
        async function fetchDish() {
            await fetchDishAPI(match.params.restaurantid, match.params.dishid, setState);
        }
        fetchDish();
    }, []);

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
                            <MenuDishInfo vegetarian={state.dish.vegetarian} vegan={state.dish.vegan} glutenFree={state.dish.glutenFree} kosher={state.dish.kosher} />
                            <MenuDishContent calories={state.dish.calories} fats={state.dish.fats} protein={state.dish.protein} carbs={state.dish.carbs} />
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
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(MenuDish));
