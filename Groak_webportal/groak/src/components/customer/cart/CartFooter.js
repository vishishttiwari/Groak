import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';

const CartFooter = (props) => {
    const { totalPrice, addToOrderHandler } = props;

    return (
        <div className="footer">
            <p className="footer-title-custom">{`$ ${totalPrice.toFixed(2)}`}</p>
            <Button
                variant="contained"
                className="footer-button"
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
    totalPrice: PropTypes.number.isRequired,
    addToOrderHandler: PropTypes.func.isRequired,
};

export default React.memo(CartFooter);
