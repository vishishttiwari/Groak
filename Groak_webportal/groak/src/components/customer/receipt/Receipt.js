import React, { useEffect, useReducer, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { randomNumber } from '../../../catalog/Others';
import './css/Receipt.css';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { CartEmpty } from '../../../catalog/Comments';
import ReceiptHeader from './ReceiptHeader';
import ReceiptFooter from './ReceiptFooter';
import OrderDishCell from '../order/OrderDishCell';
import Spinner from '../../ui/spinner/Spinner';
import { fetchOrderAPI, unsubscribeFetchOrderAPI } from './ReceiptAPICalls';
import { getTimeInAMPMFromTimeStamp } from '../../../catalog/TimesDates';
import ReceiptPriceCell from './ReceiptPriceCell';
import ReceiptRestaurantCell from './ReceiptRestaurantCell';
import Groak from '../../../assets/images/powered_by_groak_1.png';
import CustomerRequestButton from '../ui/requestButton/CustomerRequestButton';

const initialState = { order: {}, tableReceipt: 'table_receipt', loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchOrder':
            return { ...state, order: action.order, loadingSpinner: false };
        case 'setReceipt':
            return { ...state, tableReceipt: action.tableReceipt };
        default:
            return initialState;
    }
}

const CustomerMenu = (props) => {
    const { match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const top = createRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
        async function fetchOrder() {
            await fetchOrderAPI(match.params.restaurantid, match.params.tableid, setState, enqueueSnackbar);
        }
        fetchOrder();

        return () => {
            unsubscribeFetchOrderAPI(enqueueSnackbar);
        };
    }, []);

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
                                    <CustomerRequestButton restaurantId={match.params.restaurantid} tableId={match.params.tableid} />
                                    <ReceiptFooter />
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

CustomerMenu.propTypes = {
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CustomerMenu));
