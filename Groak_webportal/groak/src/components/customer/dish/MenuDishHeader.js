import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

const MenuDishHeader = (props) => {
    const { history, dishName, dishPrice } = props;

    return (
        <div className="header">
            <KeyboardBackspaceIcon
                className="header-left-icon"
                onClick={() => { history.goBack(); }}
            />
            <div className="header-content">
                <p className="header-title">{dishName}</p>
                <p className="header-subtitle">{`$ ${dishPrice.toFixed(2)}`}</p>
            </div>
        </div>
    );
};

MenuDishHeader.propTypes = {
    history: PropTypes.object.isRequired,
    dishName: PropTypes.string.isRequired,
    dishPrice: PropTypes.number.isRequired,
};

export default withRouter(React.memo(MenuDishHeader));
