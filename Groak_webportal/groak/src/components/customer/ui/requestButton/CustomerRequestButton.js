import React from 'react';
import PropTypes from 'prop-types';

import { Fab } from '@material-ui/core';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import { withRouter } from 'react-router-dom';

const CustomerRequestButton = (props) => {
    const { history, restaurantId, tableId } = props;

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
            color="primary"
            onClick={() => {
                history.push(`/customer/requests/${restaurantId}/${tableId}`);
            }}
        >
            <QuestionAnswerIcon />
        </Fab>
    );
};

CustomerRequestButton.propTypes = {
    history: PropTypes.object.isRequired,
    restaurantId: PropTypes.string.isRequired,
    tableId: PropTypes.string.isRequired,
};

export default withRouter(React.memo(CustomerRequestButton));
