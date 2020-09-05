import React from 'react';
import PropTypes from 'prop-types';
import './css/Cart.css';
import { specialInstructionsId } from '../../../catalog/Others';

const CartItemCell = (props) => {
    const { name, price, quantity, extras, clickHandler } = props;

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
        <div
            className="cart-item-cell"
            onClick={clickHandler}
        >
            <div className="cart-item-cell-content">
                <p className="cart-item-cell-quantity">{quantity}</p>
                <p className="cart-item-cell-name">{name}</p>
                <p className="cart-item-cell-price">{`$ ${price.toFixed(2)}`}</p>
            </div>
            <p className="cart-item-cell-extras">{showExtras(true)}</p>
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
