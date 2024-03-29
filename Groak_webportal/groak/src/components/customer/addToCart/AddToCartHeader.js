/**
 * Header of add to cart
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const AddToCartHeader = (props) => {
    const { history, dishName } = props;

    return (
        <div className="header">
            <KeyboardBackspaceIcon
                className="header-left-icon"
                onClick={() => { history.goBack(); }}
            />
            <div className="header-content">
                <p className="header-title">{dishName}</p>
            </div>
        </div>
    );
};

AddToCartHeader.propTypes = {
    history: PropTypes.object.isRequired,
    dishName: PropTypes.string.isRequired,
};

export default withRouter(React.memo(AddToCartHeader));
