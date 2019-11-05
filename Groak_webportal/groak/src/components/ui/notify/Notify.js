/**
 * This component is used for showing notifications at the bottom left
 */
import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

const Notify = (props) => {
    const { message } = props;

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open
            TransitionComponent="TransitionLeft"
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{message}</span>}
        />
    );
};

Notify.propTypes = {
    message: PropTypes.string.isRequired,
};

export default Notify;
