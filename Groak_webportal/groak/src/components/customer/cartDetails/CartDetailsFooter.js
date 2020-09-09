/**
 * This class is used as footer of cart details
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';

const CartDetailsFooter = (props) => {
    const { totalPrice, cartItemUpdate } = props;

    return (
        <div className="footer">
            <p className="footer-title">{`$ ${totalPrice.toFixed(2)}`}</p>
            <Button
                variant="contained"
                className="footer-button"
                onClick={() => {
                    cartItemUpdate();
                }}
            >
                Update Cart
            </Button>
        </div>
    );
};

CartDetailsFooter.propTypes = {
    totalPrice: PropTypes.number.isRequired,
    cartItemUpdate: PropTypes.func.isRequired,
};

export default React.memo(CartDetailsFooter);
