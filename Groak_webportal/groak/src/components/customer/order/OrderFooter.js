import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Button } from '@material-ui/core';

const OrderFooter = (props) => {
    const { history, match, totalPrice } = props;

    return (
        <div className="footer">
            <p className="footer-title-custom">{`$ ${totalPrice.toFixed(2)}`}</p>
            <Button
                variant="contained"
                className="footer-button"
                onClick={() => {
                    history.push(`/customer/receipt/${match.params.restaurantid}/${match.params.tableid}`);
                }}
            >
                View Receipt
            </Button>
        </div>
    );
};

OrderFooter.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    totalPrice: PropTypes.number.isRequired,
};

export default withRouter(React.memo(OrderFooter));
