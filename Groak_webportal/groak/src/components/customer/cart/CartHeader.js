import React from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '@material-ui/icons/Delete';
import { deleteCart } from '../../../catalog/LocalStorage';

const CartHeader = (props) => {
    const { restaurantId, setState } = props;

    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">Your Cart</p>
            </div>
            <DeleteIcon
                className="header-right-icon"
                onClick={() => {
                    deleteCart(restaurantId);
                    setState({ type: 'updated' });
                }}
            />
        </div>
    );
};

CartHeader.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(CartHeader);
