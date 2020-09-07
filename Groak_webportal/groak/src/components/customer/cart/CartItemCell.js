import React from 'react';
import PropTypes from 'prop-types';
import './css/Cart.css';
import { getPrice, showExtras } from '../../../catalog/Others';

const CartItemCell = (props) => {
    const { name, price, quantity, extras, clickHandler } = props;

    return (
        <div
            className="cart-item-cell"
            onClick={clickHandler}
        >
            <div className="cart-item-cell-content">
                <p className="cart-item-cell-quantity">{quantity}</p>
                <p className="cart-item-cell-name">{name}</p>
                <p className="cart-item-cell-price">{getPrice(price)}</p>
            </div>
            <p className="cart-item-cell-extras">{showExtras(extras, true)}</p>
        </div>
    );
};

CartItemCell.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    extras: PropTypes.array.isRequired,
    clickHandler: PropTypes.func.isRequired,
};

export default React.memo(CartItemCell);
