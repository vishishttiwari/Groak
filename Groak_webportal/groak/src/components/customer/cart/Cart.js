import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import CartHeader from './CartHeader';
import CartFooter from './CartFooter';
import CustomerTopic from '../ui/topic/CustomerTopic';
import { fetchCart, deleteCart } from '../../../catalog/LocalStorage';
import CustomerSpecialInstructions from '../ui/specialInstructions/CustomerSpecialInstructions';
import { randomNumber } from '../../../catalog/Others';
import './css/Cart.css';
import CartItemCell from './CartItemCell';
import CustomerNotFound from '../ui/notFound/CustomerNotFound';
import { CartEmpty } from '../../../catalog/Comments';
import Decision from '../../ui/decision/Decision';

const initialState = { deletionConfirmation: false };

function reducer(state, action) {
    switch (action.type) {
        case 'changeDeletionConfirmation':
            return { ...state, deletionConfirmation: action.deletionConfirmation };
        default:
            return initialState;
    }
}

const CustomerMenu = (props) => {
    const { history, match, setState } = props;
    const [state, setStateHere] = useReducer(reducer, initialState);

    const cart = fetchCart(match.params.restaurantid);

    const getTotalPrice = () => {
        let price = 0;
        price += parseInt(cart.map((item) => {
            return item.price;
        }), 10);
        return price;
    };

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

    return (
        <div className="cart">
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
                            <CustomerSpecialInstructions helperText="Any other instructions? (Ex: Please start with starters)" />
                        </div>
                        <CartFooter totalPrice={getTotalPrice()} />
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
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CustomerMenu));
