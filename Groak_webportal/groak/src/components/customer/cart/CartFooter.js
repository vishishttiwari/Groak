/**
 * This class is used as footer of cart
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';

const CartFooter = (props) => {
    const { totalPrice, addToOrderHandler } = props;

    return (
        <div className="footer">
            <p className="footer-title-custom">{`${totalPrice}`}</p>
            <Button
                variant="contained"
                className="footer-button-custom"
                onClick={() => {
                    addToOrderHandler();
                }}
            >
                Order
            </Button>
        </div>
    );
};

CartFooter.propTypes = {
    totalPrice: PropTypes.string.isRequired,
    addToOrderHandler: PropTypes.func.isRequired,
};

export default React.memo(CartFooter);
