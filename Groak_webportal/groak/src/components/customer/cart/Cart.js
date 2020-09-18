/**
 * Cart class for customers
 */
import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import CartHeader from './CartHeader';
import CartFooter from './CartFooter';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { fetchCart, deleteCart } from '../../../catalog/LocalStorage';
import CustomerSpecialInstructions from '../ui/specialInstructions/CustomerSpecialInstructions';
import { randomNumber, calculatePriceFromDishes, getPrice } from '../../../catalog/Others';
import './css/Cart.css';
import CartItemCell from './CartItemCell';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { CartEmpty, OtherInstructions, EmptyCartMessage } from '../../../catalog/Comments';
import Decision from '../../ui/decision/Decision';
import { isNearRestaurant } from '../../../catalog/Distance';
import { context } from '../../../globalState/globalState';
import Spinner from '../../ui/spinner/Spinner';
import { analytics } from '../../../firebase/FirebaseLibrary';
import { addOrderAPI } from './CartAPICalls';
import { NotAtRestaurant } from '../../../catalog/NotificationsComments';

const initialState = { specialInstructions: '', deletionConfirmation: false, loadingSpinner: false };

function reducer(state, action) {
    switch (action.type) {
        case 'changeDeletionConfirmation':
            return { ...state, deletionConfirmation: action.deletionConfirmation };
        case 'setSpecialInstructions':
            return { ...state, specialInstructions: action.specialInstructions };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const Cart = (props) => {
    const { history, match, setState } = props;
    const { globalState, setGlobalState } = useContext(context);
    const [state, setStateHere] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    const cart = fetchCart(match.params.restaurantid);

    /**
     * Whenever an item is clicked, this is called
     *
     * @param {*} index
     */
    const dishDetailClickHandler = (index) => {
        history.push({
            pathname: `/customer/cartdetails/${match.params.restaurantid}`,
            search: `?index=${index}`,
        });
    };

    /**
     * Ask user to confirm if they would like to delete the cart
     */
    const askDeletionHandler = () => {
        setStateHere({ type: 'changeDeletionConfirmation', deletionConfirmation: true });
    };

    /**
     * If deletion is sure then delete cart from local storage
     *
     * @param {*} open
     */
    const deletionHandler = (open) => {
        if (open) {
            deleteCart(match.params.restaurantid);
            setState({ type: 'updated' });
            setGlobalState({ type: 'setTabValueCustomer', tabValue: 0 });
        } else {
            setStateHere({ type: 'changeDeletionConfirmation', deletionConfirmation: false });
        }
    };

    /**
     * Function called when cart has to be converted to order.
     * This first checks if user is within 200 meters of user.
     * Then adds to order, deletes cart and also logs the event.
     */
    const addToOrderHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            setStateHere({ type: 'setLoadingSpinner', loadingSpinner: true });
            try {
                isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                    .then(async (nearRestaurant) => {
                        if (nearRestaurant) {
                            await addOrderAPI(match.params.restaurantid, match.params.tableid, cart, state.specialInstructions);
                            deleteCart(match.params.restaurantid);
                            setState({ type: 'updated' });
                            setGlobalState({ type: 'setTabValueCustomer', tabValue: 2 });
                            analytics.logEvent('order_placed_web', { restaurantId: match.params.restaurantid, tableId: match.params.tableid, items: cart.length, price: calculatePriceFromDishes(cart) });
                        } else {
                            enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                        }
                        setStateHere({ type: 'setLoadingSpinner', loadingSpinner: false });
                    })
                    .catch(() => {
                        setStateHere({ type: 'setLoadingSpinner', loadingSpinner: false });
                    });
            } catch (error) {
                setStateHere({ type: 'setLoadingSpinner', loadingSpinner: false });
            }
        } else {
            enqueueSnackbar('Error occurred', { variant: 'error' });
        }
    };

    return (
        <div className="cart">
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    <CartHeader deletionHandler={askDeletionHandler} />
                    <Decision
                        open={state.deletionConfirmation}
                        response={deletionHandler}
                        title="Delete Cart"
                        content={EmptyCartMessage}
                    />
                    {cart.length > 0
                        ? (
                            <>
                                <div className="content">
                                    <CustomerTopic header="Cart" />
                                    {cart.map((item, index) => {
                                        return (
                                            <CartItemCell
                                                key={randomNumber()}
                                                name={item.name}
                                                price={item.price}
                                                quantity={item.quantity}
                                                extras={item.extras}
                                                clickHandler={() => { dishDetailClickHandler(index); }}
                                            />
                                        );
                                    })}
                                    <CustomerSpecialInstructions
                                        specialInstructions={state.specialInstructions}
                                        setState={setStateHere}
                                        helperText={OtherInstructions}
                                    />
                                </div>
                                <CartFooter
                                    totalPrice={getPrice(calculatePriceFromDishes(cart))}
                                    addToOrderHandler={addToOrderHandler}
                                />
                            </>
                        )
                        : (
                            <>
                                <div className="content-not-found">
                                    <CustomerNotFound text={CartEmpty} />
                                </div>
                            </>
                        )}
                </>
            ) : null}
        </div>
    );
};

Cart.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(Cart));
