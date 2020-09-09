/**
 * This class is used as header of cart
 */
import React from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';

const CartHeader = (props) => {
    const { deletionHandler } = props;

    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">Your Cart</p>
            </div>
            <DeleteIcon
                className="header-right-icon"
                onClick={() => {
                    deletionHandler();
                }}
            />
        </div>
    );
};

CartHeader.propTypes = {
    deletionHandler: PropTypes.func.isRequired,
};

export default React.memo(CartHeader);
