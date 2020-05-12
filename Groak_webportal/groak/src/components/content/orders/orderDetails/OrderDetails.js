/**
 * This component is used to represent the order details
 */
import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';

import './css/OrderDetails.css';
import { unsubscribeFetchOrderAPI, fetchOrderAPI, fetchRequestAPI, unsubscribeFetchRequestAPI } from '../OrdersAPICalls';

import OrderDishes from './OrderDishes';
import OrderOthers from './OrderOthers';
import Spinner from '../../../ui/spinner/Spinner';
import Heading from '../../../ui/heading/Heading';

const initialState = {
    table: '',
    serve: {},
    status: '',
    comments: [],
    request: [],
    dishes: [],
    loadingSpinner: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'fetchOrder':
            return { ...state, table: action.table, status: action.status, serve: action.serve, comments: action.comments, dishes: action.dishes, loadingSpinner: false };
        case 'setStatus':
            return { ...state, status: action.status };
        case 'setServe':
            return { ...state, serve: action.serve };
        case 'setComments':
            return { ...state, comments: action.comments };
        case 'setRequest':
            return { ...state, request: action.request };
        case 'setDishes':
            return { ...state, dishes: action.dishes };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const OrderDetails = (props) => {
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchOrder() {
            await fetchOrderAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar);
            await fetchRequestAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar);
        }
        fetchOrder();

        return () => {
            unsubscribeFetchOrderAPI(enqueueSnackbar);
            unsubscribeFetchRequestAPI(enqueueSnackbar);
        };
    }, [globalState, match.params.id, enqueueSnackbar]);

    return (
        <div className="order-details">
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <div className="order-details-row">
                    <div className="order-details-col">
                        <Heading heading={state.table} className="heading" />
                        <OrderDishes
                            orderId={match.params.id}
                            status={state.status}
                            dishes={state.dishes}
                        />
                    </div>
                    <OrderOthers
                        orderId={match.params.id}
                        status={state.status}
                        comments={state.comments}
                        request={state.request}
                        dishes={state.dishes}
                        serveTimeFromServer={state.serve}
                    />
                </div>
            ) : null}
        </div>
    );
};

OrderDetails.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(OrderDetails));
