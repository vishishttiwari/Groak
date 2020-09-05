import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Button } from '@material-ui/core';

const CartFooter = (props) => {
    const { history, totalPrice } = props;

    return (
        <div className="footer">
            <p className="footer-title-custom">{`$ ${totalPrice.toFixed(2)}`}</p>
            <Button
                variant="contained"
                className="footer-button"
                onClick={() => {
                }}
            >
                Order
            </Button>
        </div>
    );
};

CartFooter.propTypes = {
    history: PropTypes.object.isRequired,
    totalPrice: PropTypes.number.isRequired,
};

export default withRouter(React.memo(CartFooter));
