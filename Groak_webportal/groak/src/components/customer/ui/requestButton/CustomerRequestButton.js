/**
 * Request button for opening chats and requests
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Fab, Badge } from '@material-ui/core';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { withRouter } from 'react-router-dom';

const CustomerRequestButton = (props) => {
    const { history, restaurantId, tableId, visible } = props;

    return (
        <Fab
            style={{
                width: '70px',
                height: '70px',
                position: 'fixed',
                right: '20px',
                bottom: '150px',
                zIndex: '30',
            }}
            color="secondary"
            onClick={() => {
                history.push(`/customer/requests/${restaurantId}/${tableId}`);
            }}
        >
            <Badge
                color="primary"
                invisible={!visible}
            >
                <QuestionAnswerIcon color="primary" />
            </Badge>
        </Fab>
    );
};

CustomerRequestButton.propTypes = {
    history: PropTypes.object.isRequired,
    restaurantId: PropTypes.string.isRequired,
    tableId: PropTypes.string.isRequired,
    visible: PropTypes.bool,
};

CustomerRequestButton.defaultProps = {
    visible: false,
};

export default withRouter(React.memo(CustomerRequestButton));
