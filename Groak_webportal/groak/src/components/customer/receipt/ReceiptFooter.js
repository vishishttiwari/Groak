/**
 * Class is used to represent footer in receipt
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { getCurrentDateTimeInStringFormat } from '../../../catalog/TimesDates';
import { context } from '../../../globalState/globalState';

const OrderFooter = (props) => {
    const { tipIndex, setState } = props;
    const { globalState } = useContext(context);

    const showTip = () => {
        setState({ type: 'showHideTip', show: true });
    };

    const saveReceipt = () => {
        htmlToImage.toBlob(document.getElementById('receipt-content'))
            .then((blob) => {
                saveAs(blob, `${globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.name ? globalState.restaurantCustomer.name : 'Groak'}-${getCurrentDateTimeInStringFormat()}.png`);
            });
    };

    /**
     * Ask user to confirm if they would like to delete the cart
     */
    const askPaymentHandler = () => {
        setState({ type: 'showHidePayment', show: true });
    };

    return (
        <div className="footer">
            <div className="footer-custom-content">
                <Button
                    variant="contained"
                    className="footer-button-custom"
                    onClick={showTip}
                >
                    Tip
                </Button>
                <Button
                    variant="contained"
                    className={tipIndex === -1 ? 'footer-button-custom footer-button-disabled' : 'footer-button-custom'}
                    disabled={tipIndex === -1}
                    onClick={saveReceipt}
                >
                    Save Receipt
                </Button>
            </div>
            <Button
                variant="contained"
                className={tipIndex === -1 ? 'footer-button-custom2 footer-button-disabled' : 'footer-button-custom2'}
                disabled={tipIndex === -1}
                onClick={askPaymentHandler}
            >
                Ready For Payment?
            </Button>
        </div>
    );
};

OrderFooter.propTypes = {
    tipIndex: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(OrderFooter);
