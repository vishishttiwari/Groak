/**
 * Used for representing receipt view
 */
import React, { useEffect, useReducer, createRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { randomNumber, TableStatus } from '../../../catalog/Others';
import './css/Receipt.css';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { CartEmpty, PaymentMessage } from '../../../catalog/Comments';
import ReceiptHeader from './ReceiptHeader';
import ReceiptFooter from './ReceiptFooter';
import OrderDishCell from '../order/OrderDishCell';
import Spinner from '../../ui/spinner/Spinner';
import { fetchOrderAPI, unsubscribeFetchOrderAPI, updateOrderAPI } from './ReceiptAPICalls';
import { getTimeInAMPMFromTimeStamp, timeoutValueForCustomer } from '../../../catalog/TimesDates';
import ReceiptPriceCell from './ReceiptPriceCell';
import ReceiptRestaurantCell from './ReceiptRestaurantCell';
import Groak from '../../../assets/images/powered_by_groak_1.png';
import CustomerRequestButton from '../ui/requestButton/CustomerRequestButton';
import { context } from '../../../globalState/globalState';
import { isNearRestaurant } from '../../../catalog/Distance';
import { NotAtRestaurant } from '../../../catalog/NotificationsComments';
import Decision from '../../ui/decision/Decision';

const initialState = { order: {}, paymentConfirmation: false, tableReceipt: 'table_receipt', loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'changePaymentConfirmation':
            return { ...state, paymentConfirmation: action.paymentConfirmation };
        case 'fetchOrder':
            return { ...state, order: action.order, loadingSpinner: false };
        case 'setReceipt':
            return { ...state, tableReceipt: action.tableReceipt };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const Receipt = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

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

        async function fetchOrder() {
            await fetchOrderAPI(match.params.restaurantid, match.params.tableid, setState, enqueueSnackbar);
        }
        fetchOrder();

        setTimeout(() => {
            history.replace('/');
        }, timeoutValueForCustomer);

        return () => {
            unsubscribeFetchOrderAPI(enqueueSnackbar);
        };
    }, [enqueueSnackbar, globalState.orderAllowedCustomer, globalState.scannedCustomer, history, match.params.restaurantid, match.params.tableid]);

    /**
     * Get total price depending on table receipt or your receipt
     */
    const getTotalPrice = () => {
        let price = 0;
        state.order.dishes.forEach((dish) => {
            if (state.tableReceipt === 'table_receipt') {
                price += parseInt(dish.price, 10);
            } else if (dish.local) {
                price += parseInt(dish.price, 10);
            }
        });
        return price;
    };

    const showDishCell = (dish) => {
        if (state.tableReceipt === 'table_receipt') {
            return (
                <OrderDishCell
                    name={dish.name}
                    price={dish.price}
                    quantity={dish.quantity}
                    extras={dish.extras}
                    localBadge={dish.local}
                    created={getTimeInAMPMFromTimeStamp(dish.created)}
                />
            );
        } if (dish.local) {
            return (
                <OrderDishCell
                    name={dish.name}
                    price={dish.price}
                    quantity={dish.quantity}
                    extras={dish.extras}
                    localBadge={dish.local}
                    created={getTimeInAMPMFromTimeStamp(dish.created)}
                />
            );
        }
        return null;
    };

    /**
     * Ask user to confirm if they would like to delete the cart
     */
    const askPaymentHandler = () => {
        setState({ type: 'changePaymentConfirmation', paymentConfirmation: true });
    };

    /**
     * Function called when ready for payment
     */
    const updateOrderHandler = async (open) => {
        if (open) {
            if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
                setState({ type: 'setLoadingSpinner', loadingSpinner: true });
                isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                    .then(async (nearRestaurant) => {
                        if (nearRestaurant) {
                            await updateOrderAPI(match.params.restaurantid, match.params.tableid, TableStatus.payment, enqueueSnackbar);
                            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                            history.goBack();
                        } else {
                            enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
                        }
                    })
                    .catch(() => {
                        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
                    });
            }
        } else {
            setState({ type: 'changePaymentConfirmation', deletionConfirmation: false });
        }
    };

    return (
        <div className="customer receipt">
            <p ref={top}> </p>
            <Spinner show={state.loadingSpinner} />
            {
                !state.loadingSpinner ? (
                    <>
                        {state.order.dishes.length > 0
                            ? (
                                <>
                                    <ReceiptHeader tableReceipt={state.tableReceipt} setState={setState} />
                                    <Decision
                                        open={state.paymentConfirmation}
                                        response={updateOrderHandler}
                                        title="Ready for payment?"
                                        content={PaymentMessage}
                                    />
                                    <div className="receipt-final-message-top">
                                    </div>
                                    <div className="content" id="receipt-content">
                                        <ReceiptRestaurantCell />
                                        <ReceiptPriceCell totalPrice={getTotalPrice()} />
                                        {state.order.dishes.map((dish) => {
                                            return (
                                                <div key={randomNumber()}>
                                                    {showDishCell(dish)}
                                                </div>
                                            );
                                        })}
                                        <div className="powered-by-groak-wrapper">
                                            <img className="powered-by-groak" src={Groak} alt="groak" />
                                        </div>
                                    </div>
                                    <div className="receipt-final-message-bottom">
                                        <ErrorOutlineIcon style={{ marginRight: '5px', marginLeft: '5px' }} />
                                        <p>To save the receipt on iphone, press save receipt below and then long press the screen to save receipt in camera roll</p>
                                    </div>
                                    <CustomerRequestButton restaurantId={match.params.restaurantid} tableId={match.params.tableid} visible={state && state.order && state.order.newRequestForUser} />
                                    <ReceiptFooter askPaymentHandler={askPaymentHandler} />
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
                ) : null
            }
        </div>
    );
};

Receipt.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Receipt));
