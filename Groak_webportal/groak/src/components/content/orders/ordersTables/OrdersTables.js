/**
 * This component represents all the tables in orders
 */
import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';

import './css/OrdersTables.css';
import OrdersTable from './OrdersTable';
import { fetchOrdersAPI, unsubscribeFetchOrdersAPI, updateOrderAPI } from '../OrdersAPICalls';
import { differenceInMinutesFromNow } from '../../../../catalog/TimesDates';
import { refreshPeriod, useInterval, OrderStatus } from '../../../../catalog/Others';
import { OrderLate } from '../../../../catalog/NotificationsComments';
import Spinner from '../../../ui/spinner/Spinner';

const initialState = {
    newOrders: [],
    updatedOrders: [],
    currentOrders: [],
    overdueOrders: [],
    servedOrders: [],
    paymentOrders: [],
    loadingSpinner: true,
};


function reducer(state, action) {
    switch (action.type) {
        case 'fetchOrders':
            return { ...state,
                newOrders: action.newOrders,
                updatedOrders: action.updatedOrders,
                currentOrders: action.currentOrders,
                overdueOrders: action.overdueOrders,
                servedOrders: action.servedOrders,
                paymentOrders: action.paymentOrders,
                loadingSpinner: false,
            };
        case 'setNewOrders':
            return { ...state, newOrders: action.newOrders };
        case 'setUpdatedOrders':
            return { ...state, updatedOrders: action.updatedOrders };
        case 'setCurrentOrders':
            return { ...state, currentOrders: action.currentOrders };
        case 'setOverdueOrders':
            return { ...state, overdueOrders: action.overdueOrders };
        case 'setServedOrders':
            return { ...state, servedOrders: action.servedOrders };
        case 'setPaymentOrders':
            return { ...state, paymentOrders: action.paymentOrders };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const Orders = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function is called whenever every 5 seconds to check if an order
     * has gone overdue
     */
    function determineOverdueOrders() {
        let newCurrentOrders = [...state.currentOrders];
        const newOverdueOrders = [...state.overdueOrders];
        state.currentOrders.forEach((order) => {
            if (differenceInMinutesFromNow(order.serveTime) < 0) {
                newCurrentOrders = newCurrentOrders.filter((order1) => {
                    return (order1.id !== order.id);
                });
                newOverdueOrders.unshift(order);
                enqueueSnackbar(OrderLate(order.table), { variant: 'error' });
            }
        });
        setState({ type: 'setCurrentOrders', currentOrders: newCurrentOrders });
        setState({ type: 'setOverdueOrders', overdueOrders: newOverdueOrders });
    }

    /**
     * Called every 5 seconds
     */
    useInterval(() => {
        determineOverdueOrders();
    }, refreshPeriod);

    useEffect(() => {
        async function fetchOrders() {
            await fetchOrdersAPI(globalState.restaurantId, state, setState, enqueueSnackbar);
        }
        fetchOrders();

        return () => {
            unsubscribeFetchOrdersAPI(enqueueSnackbar);
        };
    }, []);

    /**
     * This function is used whenever the order row is pressed
     *
     * @param {*} id order that is pressed
     */
    const clickHandler = (id) => {
        history.push(`/orders/${id}`);
    };

    /**
     * This function is called when the served button is clicked on table
     *
     * @param {*} event contains action of the button
     * @param {*} id order for which srrved was used
     */
    const servedClickHandler = async (event, id) => {
        event.stopPropagation();
        const data = { status: OrderStatus.served };
        await updateOrderAPI(globalState.restaurantId, id, data, enqueueSnackbar);
    };

    /**
     * This function is called when the paid button is clicked on table
     *
     * @param {*} event contains action of the button
     * @param {*} id order for which paid was used
     */
    const paidClickHandler = async (event, id) => {
        event.stopPropagation();
        const data = { status: OrderStatus.available };
        await updateOrderAPI(globalState.restaurantId, id, data, enqueueSnackbar);
    };

    return (
        <div className="orders">
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    <OrdersTable title="New Orders" orders={state.newOrders} onClick={clickHandler} />
                    <OrdersTable title="Orders Updated or Special Requests" orders={state.updatedOrders} onClick={clickHandler} serveTime />
                    <OrdersTable title="Due Orders" button="Served" orders={state.currentOrders} onClick={clickHandler} onButtonClick={servedClickHandler} serveTime />
                    <OrdersTable title="Overdue Orders" button="Served" orders={state.overdueOrders} onClick={clickHandler} onButtonClick={servedClickHandler} serveTime />
                    <OrdersTable title="Served Orders" orders={state.servedOrders} onClick={clickHandler} />
                    <OrdersTable title="Orders ready for payment" button="Paid" orders={state.paymentOrders} onClick={clickHandler} onButtonClick={paidClickHandler} />
                </>
            ) : null}
        </div>
    );
};

Orders.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Orders));
