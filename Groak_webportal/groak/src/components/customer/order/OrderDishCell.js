import React from 'react';
import PropTypes from 'prop-types';
import './css/Order.css';
import { specialInstructionsId } from '../../../catalog/Others';

const OrderDishCell = (props) => {
    const { name, price, quantity, extras, localBadge, created } = props;

    /**
     * This function is used to show all the extras selected for a dish in cart and in order
     *
     * @param dishExtras
     * @param showSpecialInstructions
     * @return
     */
    const showExtras = (showSpecialInstructions) => {
        let str = '';
        extras.forEach((extra) => {
            if (extra.options.length > 0) {
                if (extra.title !== specialInstructionsId) {
                    str += `${extra.title}:\n`;
                    extra.options.forEach((option) => {
                        str += `\t-${option.title}: $${option.price.toFixed(2)}\n`;
                    });
                } else if (showSpecialInstructions) {
                    str += 'Special Instructions:\n';
                    extra.options.forEach((option) => {
                        str += `\t-${option.title}: $${option.price.toFixed(2)}\n`;
                    });
                }
            }
        });

        if (str.length > 2) {
            if (str.endsWith('\n')) return str.substring(0, str.length - 1);
            return str;
        }
        return str;
    };

    return (
        <div className="order-dish-cell">
            <div className="order-dish-cell-content">
                <p className="order-dish-cell-quantity">{quantity}</p>
                <p className="order-dish-cell-name">{name}</p>
                <p className="order-dish-cell-price">{`$ ${price.toFixed(2)}`}</p>
            </div>
            <p className="order-dish-cell-extras">{showExtras(true)}</p>
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
