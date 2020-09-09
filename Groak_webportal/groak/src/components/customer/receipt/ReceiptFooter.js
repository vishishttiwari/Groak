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
    const { askPaymentHandler } = props;
    const { globalState } = useContext(context);

    return (
        <div className="footer">
            <Button
                variant="contained"
                className="footer-button-custom"
                onClick={() => {
                    htmlToImage.toBlob(document.getElementById('receipt-content'))
                        .then((blob) => {
                            saveAs(blob, `${globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.name ? globalState.restaurantCustomer.name : 'Groak'}-${getCurrentDateTimeInStringFormat()}.png`);
                        });
                }}
            >
                Save Receipt
            </Button>
            <Button
                variant="contained"
                className="footer-button"
                onClick={async () => {
                    askPaymentHandler();
                }}
            >
                Ready For Payment?
            </Button>
        </div>
    );
};

OrderFooter.propTypes = {
    askPaymentHandler: PropTypes.func.isRequired,
};

export default React.memo(OrderFooter);
