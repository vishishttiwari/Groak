import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import CustomerTopic from '../ui/topic/CustomerTopic';
import { randomNumber, TableStatus } from '../../../catalog/Others';
import './css/Order.css';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { CartEmpty } from '../../../catalog/Comments';
import OrderHeader from './OrderHeader';
import OrderFooter from './OrderFooter';
import OrderDishCell from './OrderDishCell';
import { getTimeInAMPMFromTimeStamp } from '../../../catalog/TimesDates';
import OrderCommentCell from './OrderCommentCell';
import OrderSpecialInstructions from './OrderSpecialInstructions';
import { context } from '../../../globalState/globalState';
import { addCommentFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { isNearRestaurant } from '../../../catalog/Distance';
import CustomerInfo from '../ui/info/CustomerInfo';

const initialState = { specialInstructions: '', tableOrder: 'table_order' };

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

const CustomerMenu = (props) => {
    const { match, order } = props;
    const { globalState } = useContext(context);
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    const getOrderStatus = () => {
        let status = '';

        if (order.status === TableStatus.ordered) status = 'Your order has been requested. Pending for approval.';
        if (order.status === TableStatus.served) status = 'Your order has been served. Enjoy!';
        if (order.status === TableStatus.payment) status = 'You have requested for payment. Someone will be at your table soon.';
        if (order.status === TableStatus.available || order.status === TableStatus.seated) status = 'You can start ordering. Your orders will appear below.';
        if (order.status === TableStatus.approved) status = `Your order will be served at ${getTimeInAMPMFromTimeStamp(order.serveTime)}`;

        if (status.length <= 0) return null;
        return (
            <>
                <CustomerTopic header="Order Status" />
                <CustomerInfo info={status} />
            </>
        );
    };

    const getTotalPrice = () => {
        let price = 0;
        order.dishes.forEach((dish) => {
            if (state.tableOrder === 'table_order') {
                price += parseInt(dish.price, 10);
            } else if (dish.local) {
                price += parseInt(dish.price, 10);
            }
        });
        return price;
    };

    const showDishCell = (dish) => {
        if (state.tableOrder === 'table_order') {
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

    const showCommentCell = (comment) => {
        if (state.tableOrder === 'table_order') {
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

    const addToOrderHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                .then(async (nearRestaurant) => {
                    if (nearRestaurant) {
                        await addCommentFirestoreAPI(match.params.restaurantid, match.params.tableid, state.specialInstructions);
                        setState({ type: 'setSpecialInstructions', specialInstructions: '' });
                    } else {
                        enqueueSnackbar('Seems like you are not at the restaurant. Please order while you are at the restaurant.', { variant: 'error' });
                    }
                })
                .catch(() => {
                });
        }
    };

    return (
        <div className="order">
            <OrderHeader tableOrder={state.tableOrder} setState={setState} />
            {order.dishes.length > 0
                ? (
                    <>
                        <div className="content">
                            {getOrderStatus()}
                            <CustomerTopic header="Order" />
                            {order.dishes.map((dish) => {
                                return (
                                    <div key={randomNumber()}>
                                        {showDishCell(dish)}
                                    </div>
                                );
                            })}
                            <OrderSpecialInstructions
                                specialInstructions={state.specialInstructions}
                                setState={setState}
                                helperText="Any other instructions? (Ex: Please start with starters)"
                                addToOrderHandler={addToOrderHandler}
                            />
                            {order.comments.map((comment) => {
                                return (
                                    <div key={randomNumber()}>
                                        {showCommentCell(comment)}
                                    </div>
                                );
                            })}
                        </div>
                        <OrderFooter totalPrice={getTotalPrice()} />
                    </>
                )
                : (
                    <>
                        <div className="content-not-found">
                            <CustomerNotFound text={CartEmpty} />
                        </div>
                    </>
                )}
        </div>
    );
};

CustomerMenu.propTypes = {
    match: PropTypes.object.isRequired,
    order: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CustomerMenu));
