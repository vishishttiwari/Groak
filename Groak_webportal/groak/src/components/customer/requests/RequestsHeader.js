import React from 'react';
import PropTypes from 'prop-types';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { withRouter } from 'react-router-dom';

const RequestsHeader = (props) => {
    const { history, restaurantName } = props;

    return (
        <div className="header">
            <KeyboardBackspaceIcon
                className="header-left-icon"
                onClick={() => { history.goBack(); }}
            />
            <div className="header-content">
                <p className="header-title">{restaurantName}</p>
            </div>
        </div>
    );
};

RequestsHeader.propTypes = {
    history: PropTypes.object.isRequired,
    restaurantName: PropTypes.string.isRequired,
};

export default withRouter(React.memo(RequestsHeader));
