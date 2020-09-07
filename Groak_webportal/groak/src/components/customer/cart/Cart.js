import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import CartHeader from './CartHeader';
import CartFooter from './CartFooter';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { fetchCart, deleteCart } from '../../../catalog/LocalStorage';
import CustomerSpecialInstructions from '../ui/specialInstructions/CustomerSpecialInstructions';
import { randomNumber, calculatePriceFromDishes } from '../../../catalog/Others';
import './css/Cart.css';
import CartItemCell from './CartItemCell';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { CartEmpty } from '../../../catalog/Comments';
import Decision from '../../ui/decision/Decision';
import { addOrderFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { isNearRestaurant } from '../../../catalog/Distance';
import { context } from '../../../globalState/globalState';
import Spinner from '../../ui/spinner/Spinner';

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

const CustomerMenu = (props) => {
    const { history, match, setState } = props;
    const { globalState } = useContext(context);
    const [state, setStateHere] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    const cart = fetchCart(match.params.restaurantid);

    const dishDetailClickHandler = (index) => {
        history.push({
            pathname: `/customer/cartdetails/${match.params.restaurantid}`,
            search: `?index=${index}`,
        });
    };

    const askDeletionHandler = () => {
        setStateHere({ type: 'changeDeletionConfirmation', deletionConfirmation: true });
    };

    const deletionHandler = (open) => {
        if (open) {
            deleteCart(match.params.restaurantid);
            setState({ type: 'updatedCart' });
        } else {
            setStateHere({ type: 'changeDeletionConfirmation', deletionConfirmation: false });
        }
    };

    const addToOrderHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            setStateHere({ type: 'setLoadingSpinner', loadingSpinner: true });
            try {
                isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                    .then(async (nearRestaurant) => {
                        if (nearRestaurant) {
                            await addOrderFirestoreAPI(match.params.restaurantid, match.params.tableid, cart, state.specialInstructions);
                            deleteCart(match.params.restaurantid);
                            setState({ type: 'updatedCart' });
                        } else {
                            enqueueSnackbar('Seems like you are not at the restaurant. Please order while you are at the restaurant.', { variant: 'error' });
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
                        content="Would you like to empty the cart?"
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
                                        helperText="Any other instructions? (Ex: Please start with starters)"
                                    />
                                </div>
                                <CartFooter
                                    totalPrice={calculatePriceFromDishes(cart)}
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

CustomerMenu.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CustomerMenu));
