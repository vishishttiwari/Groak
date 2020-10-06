/**
 * Used for confirming with user if they are ok with asking for waiter
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import { WaiterMessage } from '../../../catalog/Comments';

const WaiterPayment = (props) => {
    const { waiterConfirmation, askForWaiterHandler, setState } = props;

    const hideWaiter = () => {
        setState({ type: 'hideWaiter' });
    };

    return (
        <Dialog
            className="popup pop-up-after-restaurant"
            open={waiterConfirmation}
            onClose={hideWaiter}
        >
            <div className="pop-up-after-restaurant-title">
                <p>Ready for payment?</p>
                <IconButton onClick={hideWaiter}>
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
            <DialogContent className="popup-content">
                {WaiterMessage}
            </DialogContent>
            <DialogActions className="popup-actions">
                <Button onClick={hideWaiter} className="popup-button popup-button-cancel">
                    Cancel
                </Button>
                <Button onClick={askForWaiterHandler} className="popup-button">
                    Ask for waiter
                </Button>
            </DialogActions>
        </Dialog>
    );
};

WaiterPayment.propTypes = {
    waiterConfirmation: PropTypes.bool.isRequired,
    askForWaiterHandler: PropTypes.func.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(WaiterPayment);
