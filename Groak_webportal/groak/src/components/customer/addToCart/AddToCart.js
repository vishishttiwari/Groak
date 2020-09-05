import React, { useEffect, useReducer, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { fetchDishAPI } from '../dish/MenuDishAPICalls';
import Spinner from '../../ui/spinner/Spinner';
import './css/AddToCart.css';
import AddToCartHeader from './AddToCartHeader';
import AddToCartFooter from './AddToCartFooter';
import AddToCartCategory from './AddToCartCategory';
import { randomNumber } from '../../../catalog/Others';
import { saveToCart } from '../../../catalog/LocalStorage';
import CustomerSpecialInstructions from '../ui/customerSpecialInstructions/CustomerSpecialInstructions';
import { OptionsExceedingMin } from '../../../catalog/NotificationsComments';

const initialState = { dish: {}, optionsSelected: [], quantity: 1, totalPrice: 0, loadingSpinner: true };

function reducer(state, action) {
    let updatedOptionsSelected;
    switch (action.type) {
        case 'fetchDish':
            updatedOptionsSelected = new Array(action.dish.extras.length).fill([]);
            action.dish.extras.forEach((dish, index) => {
                updatedOptionsSelected[index] = new Array(dish.options.length).fill(false);
            });
            return { ...state, dish: action.dish, optionsSelected: updatedOptionsSelected, totalPrice: action.dish.price, loadingSpinner: false };
        case 'changeOptionsSelected':
            return { ...state, optionsSelected: action.optionsSelected, totalPrice: state.totalPrice + action.priceDelta };
        case 'changeQuantity':
            return { ...state, quantity: action.quantity };
        default:
            return initialState;
    }
}

const AddToCart = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

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

    const addToCartHandler = () => {
        const extras = [];
        let success = true;
        state.optionsSelected.forEach((extra, extraIndex) => {
            const options = [];
            extra.forEach((option, optionIndex) => {
                if (option) {
                    options.push({
                        title: state.dish.extras[extraIndex].options[optionIndex].title,
                        price: state.dish.extras[extraIndex].options[optionIndex].price,
                        optionIndex });
                }
            });
            if (state.dish.extras[extraIndex].multipleSelections) {
                if (options.length < state.dish.extras[extraIndex].minOptionsSelect) {
                    success = false;
                    enqueueSnackbar(OptionsExceedingMin(state.dish.extras[extraIndex].title, state.dish.extras[extraIndex].minOptionsSelect), { variant: 'error' });
                    return;
                }
            } else if (options.length <= 0) {
                success = false;
                enqueueSnackbar(OptionsExceedingMin(state.dish.extras[extraIndex].title, 1), { variant: 'error' });
                return;
            }
            extras.push({
                title: state.dish.extras[extraIndex].title,
                options,
            });
        });
        if (!success) {
            return;
        }
        const cartDish = {
            name: state.dish.name,
            dishId: state.dish.id,
            restaurantId: match.params.restaurantid,
            price: state.quantity,
            quantity: state.quantity,
            pricePerItem: state.quantity,
            extras,
        };

        saveToCart(match.params.restaurantid, cartDish);
        history.go(-2);
    };

    return (
        <div className="customer addtocart">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {
                !state.loadingSpinner ? (
                    <>
                        <AddToCartHeader dishName={state.dish.name} />
                        <div className="content">
                            {state.dish.extras.map((extra, index) => {
                                return (
                                    <AddToCartCategory
                                        key={randomNumber()}
                                        extra={extra}
                                        extraIndex={index}
                                        optionsSelected={state.optionsSelected}
                                        setState={setState}
                                    />
                                );
                            })}
                            <CustomerSpecialInstructions helperText="Leave a note for the kitchen" />
                        </div>
                        <AddToCartFooter
                            dishPrice={state.totalPrice}
                            quantity={state.quantity}
                            setState={setState}
                            addToCartHandler={addToCartHandler}
                        />
                    </>
                ) : null
            }
        </div>
    );
};

AddToCart.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(AddToCart));
