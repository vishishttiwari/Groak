/**
 * Used for representing dish cell in order
 */
import React from 'react';
import PropTypes from 'prop-types';
import './css/Order.css';
import { showExtras, getPrice } from '../../../catalog/Others';

const OrderDishCell = (props) => {
    const { name, price, quantity, extras, localBadge, created } = props;

    return (
        <div className="order-dish-cell">
            <div className="order-dish-cell-content">
                <p className="order-dish-cell-quantity">{quantity}</p>
                <p className="order-dish-cell-name">{name}</p>
                <p className="order-dish-cell-price">{getPrice(price)}</p>
            </div>
            <p className="order-dish-cell-extras">{showExtras(extras, true)}</p>
            <div className="order-dish-cell-content-1">
                {localBadge ? <p className="order-dish-cell-local-badge">Your Order</p> : null}
                <p className="order-dish-cell-created">{created}</p>
            </div>
        </div>
    );
};

OrderDishCell.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    extras: PropTypes.array.isRequired,
    localBadge: PropTypes.bool.isRequired,
    created: PropTypes.string.isRequired,
};

export default React.memo(OrderDishCell);
