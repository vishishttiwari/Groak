/**
 * Used for representing the payment options in receipt screen
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import Venmo from '../../../assets/others/venmo_logo_white.png';
import ReceiptPriceCell from './ReceiptPriceCell';
// import { VenmoUsageMessage } from '../../../catalog/Comments';

const PaymentOptions = (props) => {
    const { paymentMethods, dishes, tip, paymentConfirmation, setState } = props;

    const close = () => {
        setState({ type: 'showHidePayment', show: false });
    };

    const askForWaiter = () => {
        setState({ type: 'showWaiter' });
    };

    const askForVenmo = () => {
        setState({ type: 'showVenmo' });
    };

    return (
        <Dialog
            className="popup pop-up-after-restaurant"
            open={paymentConfirmation}
            onClose={close}
        >
            <div className="pop-up-after-restaurant-title">
                <p>Payment Options</p>
                <IconButton onClick={close}>
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
            <DialogContent className="popup-content">
                <ReceiptPriceCell tableReceipt="table" dishes={dishes} tip={tip} />
            </DialogContent>
            <DialogActions className="popup-actions">
                <Button onClick={askForWaiter} className="popup-button">
                    Ask for waiter
                </Button>
                {paymentMethods && paymentMethods.venmo ? (
                    <>
                        <div onClick={askForVenmo} className="popup-venmo-button">
                            <img className="popup-venmo-image" src={Venmo} alt="Venmo" />
                        </div>
                        {/* <p style={{ color: 'grey', margin: '20px', textAlign: 'center' }}>{VenmoUsageMessage}</p> */}
                    </>
                ) : null}
            </DialogActions>
        </Dialog>
    );
};

PaymentOptions.propTypes = {
    paymentMethods: PropTypes.object.isRequired,
    dishes: PropTypes.array.isRequired,
    tip: PropTypes.number.isRequired,
    paymentConfirmation: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(PaymentOptions);
