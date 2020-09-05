import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import CartHeader from './CartHeader';
import CartFooter from './CartFooter';
import CustomerTopic from '../ui/customerTopic/CustomerTopic';
import { fetchCart } from '../../../catalog/LocalStorage';
import CustomerSpecialInstructions from '../ui/customerSpecialInstructions/CustomerSpecialInstructions';
import { randomNumber } from '../../../catalog/Others';
import './css/Cart.css';
import CartItemCell from './CartItemCell';

const CustomerMenu = (props) => {
    const { history, match, setState } = props;
    const top = createRef(null);

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

    return (
        <div className="cart">
            <p ref={top}> </p>
            <CartHeader restaurantId={match.params.restaurantid} setState={setState} />
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
                : null}
        </div>
    );
};

CustomerMenu.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CustomerMenu));
