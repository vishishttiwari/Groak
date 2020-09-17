/**
 * The class is used for representing order
 */
import React, { useReducer, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import CustomerTopic from '../ui/topic/CustomerTopic';
import { calculatePriceFromDishes, randomNumber, TableStatus } from '../../../catalog/Others';
import './css/Order.css';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { OrderOrdered, OrderServed, OrderPayment, VenmoPayment, OrderAvailable, OrderApproved, OrderEmpty, OtherInstructions } from '../../../catalog/Comments';
import OrderHeader from './OrderHeader';
import OrderFooter from './OrderFooter';
import OrderDishCell from './OrderDishCell';
import { getTimeInAMPMFromTimeStamp } from '../../../catalog/TimesDates';
import OrderCommentCell from './OrderCommentCell';
import OrderSpecialInstructions from './OrderSpecialInstructions';
import { context } from '../../../globalState/globalState';
import { addCommentFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { isNearRestaurant } from '../../../catalog/Distance';
import { updateOrderWhenSeenAPI } from './OrderAPICalls';
import { NotAtRestaurant } from '../../../catalog/NotificationsComments';

const initialState = { specialInstructions: '', tableOrder: 'table' };

function reducer(state, action) {
    switch (action.type) {
        case 'setOrder':
            return { ...state, tableOrder: action.tableOrder };
        case 'setSpecialInstructions':
            return { ...state, specialInstructions: action.specialInstructions };
        default:
            return initialState;
    }
}

const Order = (props) => {
    const { match, order } = props;
    const { globalState } = useContext(context);
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function updateRequest() {
            await updateOrderWhenSeenAPI(match.params.restaurantid, match.params.tableid);
        }
        updateRequest();
    }, [match.params.restaurantid, match.params.tableid]);

    /**
     * Used for seeing which order status will be shown
     */
    const getOrderStatus = () => {
        let status = '';

        if (order.status === TableStatus.ordered) status = OrderOrdered;
        if (order.status === TableStatus.served) status = OrderServed;
        if (order.status === TableStatus.payment) {
            if (order.paymentMethod && order.paymentMethod === 'venmo') status = VenmoPayment;
            else status = OrderPayment;
        }
        if (order.status === TableStatus.available || order.status === TableStatus.seated) status = OrderAvailable;
        if (order.status === TableStatus.approved) status = OrderApproved(order.serveTime);

        if (status.length <= 0) return null;
        return (
            <>
                <CustomerTopic header="Order Status" />
                <div className="info">
                    <p style={{ textAlign: 'center' }} className="info-info">
                        {status}
                    </p>
                </div>
            </>
        );
    };

    /**
     * Shows dish cell depending on if it supposed to be shown
     * depending on your order or table order
     *
     * @param {*} dish
     */
    const showDishCell = (dish) => {
        if (state.tableOrder === 'table') {
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
     * Shows comment cell depending on if it supposed to be shown
     * depending on your order or table order
     *
     * @param {*} comment
     */
    const showCommentCell = (comment) => {
        if (state.tableOrder === 'table') {
            return (
                <OrderCommentCell
                    comment={comment.comment}
                    localBadge={comment.local}
                    created={getTimeInAMPMFromTimeStamp(comment.created)}
                />
            );
        } if (comment.local) {
            return (
                <OrderCommentCell
                    comment={comment.comment}
                    localBadge={comment.local}
                    created={getTimeInAMPMFromTimeStamp(comment.created)}
                />
            );
        }
        return null;
    };

    /**
     * Function is used for adding comment to order.
     * It depends if you are near the restaurant or not.
     */
    const addToOrderHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                .then(async (nearRestaurant) => {
                    if (nearRestaurant) {
                        await addCommentFirestoreAPI(match.params.restaurantid, match.params.tableid, state.specialInstructions);
                        setState({ type: 'setSpecialInstructions', specialInstructions: '' });
                    } else {
                        enqueueSnackbar(NotAtRestaurant, { variant: 'error' });
                    }
                })
                .catch(() => {
                });
        }
    };

    return (
        <div className="order">
            <OrderHeader tableOrder={state.tableOrder} setState={setState} />
            {order && order.dishes ? (
                <>
                    {order.dishes.length > 0
                        ? (
                            <>
                                <div className="content">
                                    {getOrderStatus()}
                                    <CustomerTopic header="Order" />
                                    {order && order.dishes ? (
                                        <>
                                            {order.dishes.map((dish) => {
                                                return (
                                                    <div key={randomNumber()}>
                                                        {showDishCell(dish)}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : null}
                                    <OrderSpecialInstructions
                                        specialInstructions={state.specialInstructions}
                                        setState={setState}
                                        helperText={OtherInstructions}
                                        addToOrderHandler={addToOrderHandler}
                                    />
                                    {order && order.comments ? (
                                        <>
                                            {order.comments.map((comment) => {
                                                return (
                                                    <div key={randomNumber()}>
                                                        {showCommentCell(comment)}
                                                    </div>
                                                );
                                            })}
                                        </>
                                    ) : null}
                                </div>
                                <OrderFooter totalPrice={calculatePriceFromDishes(order.dishes, state.tableOrder)} />
                            </>
                        )
                        : (
                            <>
                                <div className="content-not-found">
                                    <CustomerNotFound text={OrderEmpty} />
                                </div>
                            </>
                        )}
                </>
            ) : null}

        </div>
    );
};

Order.propTypes = {
    match: PropTypes.object.isRequired,
    order: PropTypes.object,
};

Order.defaultProps = {
    order: {},
};

export default withRouter(React.memo(Order));
