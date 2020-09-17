/**
 * Used for confirming with user if they are ok with asking for waiter
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { WaiterMessage } from '../../../catalog/Comments';

const WaiterPayment = (props) => {
    const { waiterConfirmation, askForWaiterHandler, setState } = props;

    const hideWaiter = () => {
        setState({ type: 'hideWaiter' });
    };

    return (
        <Dialog
            className="popup"
            open={waiterConfirmation}
            onClose={hideWaiter}
        >
            <p className="popup-title">Ready for payment?</p>
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
