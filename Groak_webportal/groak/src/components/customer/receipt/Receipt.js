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
import { CartEmpty, iPhoneReceiptSave } from '../../../catalog/Comments';
import ReceiptHeader from './ReceiptHeader';
import ReceiptFooter from './ReceiptFooter';
import OrderDishCell from '../order/OrderDishCell';
import Spinner from '../../ui/spinner/Spinner';
import { fetchOrderAPI, unsubscribeFetchOrderAPI, updateOrderAPI } from './ReceiptAPICalls';
import { getTimeInAMPMFromTimeStamp, timeoutValueForCustomer } from '../../../catalog/TimesDates';
import ReceiptPriceCell from './ReceiptPriceCell';
import ReceiptRestaurantCell from './ReceiptRestaurantCell';
import Groak from '../../../assets/images/powered_by_groak_2.png';
import CustomerRequestButton from '../ui/requestButton/CustomerRequestButton';
import { context } from '../../../globalState/globalState';
import { isNearRestaurant } from '../../../catalog/Distance';
import { NotAtRestaurant, VenmoNotSupported } from '../../../catalog/NotificationsComments';
import PaymentOptions from './PaymentOptions';
import Tip from './Tip';
import WaiterPayment from './WaiterPayment';
import VenmoPayment from './VenmoPayment';

const initialState = {
    order: {},
    tipValue: -1,
    tipIndex: -1,
    tipConfirmation: false,
    paymentConfirmation: false,
    waiterConfirmation: false,
    venmoConfirmation: false,
    tableReceipt: 'table',
    loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchOrder':
            return { ...state,
                order: action.order,
                loadingSpinner: false,
                tipValue: action.order && action.order.tip && action.order.tip.tipValue ? action.order.tip.tipValue : -1,
                tipIndex: action.order && action.order.tip && action.order.tip.tipIndex !== null ? action.order.tip.tipIndex : -1 };
        case 'showHideTip':
            return { ...state, tipConfirmation: action.show };
        case 'changeTip':
            return { ...state, tipIndex: action.tipIndex, tipValue: action.tipValue, tipConfirmation: false };
        case 'showHidePayment':
            return { ...state, paymentConfirmation: action.show };
        case 'showWaiter':
            return { ...state, paymentConfirmation: false, waiterConfirmation: true };
        case 'hideWaiter':
            return { ...state, waiterConfirmation: false };
        case 'showVenmo':
            return { ...state, paymentConfirmation: false, venmoConfirmation: true };
        case 'hideVenmo':
            return { ...state, venmoConfirmation: false };
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

    // useEffect(() => {
    //     top.current.scrollIntoView({
    //         behavior: 'smooth',
    //         block: 'center',
    //         inline: 'start',
    //     });
    // }, [top]);

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

    const showDishCell = (dish) => {
        if (state.tableReceipt === 'table') {
            return (
                <OrderDishCell
                    restaurantId={match.params.restaurantid}
                    dishId={dish.dishReference.id}
                    name={dish.name}
                    price={dish.price}
                    quantity={dish.quantity}
                    extras={dish.extras}
                    localBadge={dish.local}
                    created={getTimeInAMPMFromTimeStamp(dish.created)}
                    showLikes
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
                    showLikes
                />
            );
        }
        return null;
    };

    /**
     * Function called when paying using venmo
     */
    const venmoHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.paymentMethods && globalState.restaurantCustomer.paymentMethods.venmo) {
            if (state.venmoConfirmation) {
                if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
                    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
                    isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                        .then(async (nearRestaurant) => {
                            if (nearRestaurant) {
                                await updateOrderAPI(match.params.restaurantid, match.params.tableid, TableStatus.payment, { tipValue: Math.max(state.tipValue, 0), tipIndex: state.tipIndex }, 'venmo', enqueueSnackbar);
                                setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                                history.goBack();
                                window.location.assign(`https://venmo.com/${globalState.restaurantCustomer.paymentMethods.venmo}`);
                            } else {
                                enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                                setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                            }
                        })
                        .catch(() => {
                            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                        });
                }
            } else {
                setState({ type: 'hideWaiter' });
            }
        } else {
            enqueueSnackbar(VenmoNotSupported, { variant: 'error' });
        }
    };

    /**
     * Function called when asking for waiter
     */
    const updateOrderHandler = async () => {
        if (state.waiterConfirmation) {
            if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
                setState({ type: 'setLoadingSpinner', loadingSpinner: true });
                isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                    .then(async (nearRestaurant) => {
                        if (nearRestaurant) {
                            await updateOrderAPI(match.params.restaurantid, match.params.tableid, TableStatus.payment, { tipValue: Math.max(state.tipValue, 0), tipIndex: state.tipIndex }, 'waiter', enqueueSnackbar);
                            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                            history.goBack();
                        } else {
                            enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                        }
                    })
                    .catch(() => {
                        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                    });
            }
        } else {
            setState({ type: 'hideVenmo' });
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
                                    <Tip
                                        tableReceipt={state.tableReceipt}
                                        dishes={state.order.dishes}
                                        tips={globalState.restaurantCustomer.payments[0]}
                                        tipIndex={state.tipIndex}
                                        tipConfirmation={state.tipConfirmation}
                                        setState={setState}
                                    />
                                    <PaymentOptions
                                        tableReceipt={state.tableReceipt}
                                        paymentMethods={globalState.restaurantCustomer.paymentMethods}
                                        dishes={state.order.dishes}
                                        tip={state.tipValue}
                                        paymentConfirmation={state.paymentConfirmation}
                                        setState={setState}
                                    />
                                    <WaiterPayment
                                        waiterConfirmation={state.waiterConfirmation}
                                        askForWaiterHandler={updateOrderHandler}
                                        setState={setState}
                                    />
                                    <VenmoPayment
                                        tableReceipt={state.tableReceipt}
                                        dishes={state.order.dishes}
                                        tip={state.tipValue}
                                        venmoConfirmation={state.venmoConfirmation}
                                        venmoHandler={venmoHandler}
                                        setState={setState}
                                    />
                                    <div className="content" id="receipt-content">
                                        <ReceiptRestaurantCell />
                                        <ReceiptPriceCell tableReceipt={state.tableReceipt} dishes={state.order.dishes} tip={state.tipValue} />
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
                                        <p>{iPhoneReceiptSave}</p>
                                    </div>
                                    <CustomerRequestButton restaurantId={match.params.restaurantid} tableId={match.params.tableid} visible={state && state.order && state.order.newRequestForUser} />
                                    <ReceiptFooter tipIndex={state.tipIndex} setState={setState} />
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
