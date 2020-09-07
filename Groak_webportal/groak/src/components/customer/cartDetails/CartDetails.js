import React, { useEffect, useReducer, createRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Button } from '@material-ui/core';
import CartDetailsHeader from './CartDetailsHeader';
import CartDetailsFooter from './CartDetailsFooter';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { fetchCartItem, deleteCartItem } from '../../../catalog/LocalStorage';
import './css/cartDetails.css';
import { specialInstructionsId } from '../../../catalog/Others';
import Spinner from '../../ui/spinner/Spinner';
import { context } from '../../../globalState/globalState';
import { timeoutValueForCustomer } from '../../../catalog/TimesDates';

const initialState = { cartItem: { name: '', price: 0, extras: [] }, index: -1 };

function reducer(state, action) {
    let updatedCartItem;
    switch (action.type) {
        case 'fetchCartItem':
            return { ...state, cartItem: action.cartItem, index: action.index };
        case 'changeQuantity':
            updatedCartItem = { ...state.cartItem, quantity: action.quantity };
            return { ...state, cartItem: updatedCartItem };
        default:
            return initialState;
    }
}

const CartDetails = (props) => {
    const { history, match, location } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const top = createRef(null);

    useEffect(() => {
        if (!globalState.scannedCustomer) {
            history.replace('/');
        }

        let index = -1;
        const query = new URLSearchParams(location.search);
        query.forEach((value, key) => {
            if (key === 'index') {
                index = parseInt(value, 10);
            }
        });

        const cart = fetchCartItem(match.params.restaurantid, index);
        if (!cart || !cart.name) {
            history.goBack();
        } else if (index >= 0) {
            setState({
                type: 'fetchCartItem',
                cartItem: cart,
                index,
            });
        } else {
            history.goBack();
        }

        setTimeout(() => {
            history.replace('/');
        }, timeoutValueForCustomer);
    }, []);

    /**
     * This function is used to show all the extras selected for a dish in cart and in order
     *
     * @param dishExtras
     * @param showSpecialInstructions
     * @return
     */
    const showExtras = (showSpecialInstructions) => {
        let str = '';
        state.cartItem.extras.forEach((extra) => {
            if (extra.options.length > 0) {
                if (extra.title !== specialInstructionsId) {
                    str += `${extra.title}:\n`;
                    extra.options.forEach((option) => {
                        str += `\t-${option.title}: $${option.price.toFixed(2)}\n`;
                    });
                } else if (showSpecialInstructions) {
                    str += 'Special Instructions:\n';
                    extra.options.forEach((option) => {
                        str += `\t-${option.title}: $${option.price.toFixed(2)}\n`;
                    });
                }
            }
        });

        if (str.length > 2) {
            if (str.endsWith('\n')) return str.substring(0, str.length - 1);
            return str;
        }
        return str;
    };

    return (
        <div className="customer cart-details">
            <p ref={top}> </p>

            <Spinner show={state.index === -1} />
            {
                state.index >= 0 ? (
                    <>
                        <CartDetailsHeader dishName={state.cartItem.name} />
                        <div className="content">
                            {state.cartItem.extras.length > 0 ? (
                                <>
                                    <CustomerTopic header="Cart Item Details" />
                                    <p className="cart-details-extras">{showExtras(true)}</p>
                                </>
                            ) : null}
                            <CustomerTopic header="Quantity" />
                            <div className="cart-details-quantity-wrapper">
                                <div className="cart-details-quantity">
                                    <RemoveCircleOutlineIcon
                                        className="cart-details-remove"
                                        onClick={() => {
                                            setState({
                                                type: 'changeQuantity',
                                                quantity: Math.max(state.cartItem.quantity - 1, 1),
                                            });
                                        }}
                                    />
                                    <p className="footer-title">{`${state.cartItem.quantity}`}</p>
                                    <AddCircleOutlineIcon
                                        className="cart-details-add"
                                        onClick={() => {
                                            setState({
                                                type: 'changeQuantity',
                                                quantity: state.cartItem.quantity + 1,
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <Button
                                variant="contained"
                                className="cart-details-delete-button"
                                onClick={() => {
                                    deleteCartItem(match.params.restaurantid, state.index);
                                    history.goBack();
                                }}
                            >
                                Delete Item
                            </Button>
                        </div>
                        <CartDetailsFooter
                            totalPrice={state.cartItem.price}
                        />
                    </>
                ) : null
            }
        </div>
    );
};

CartDetails.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CartDetails));
