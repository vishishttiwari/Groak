import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Button } from '@material-ui/core';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { getCurrentDateTimeInStringFormat } from '../../../catalog/TimesDates';
import { context } from '../../../globalState/globalState';
import { updateOrderAPI } from './ReceiptAPICalls';
import { TableStatus } from '../../../catalog/Others';
import { isNearRestaurant } from '../../../catalog/Distance';

const OrderFooter = (props) => {
    const { history, match } = props;
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    const updateOrderHandler = async () => {
        if (globalState && globalState.restaurantCustomer && globalState.restaurantCustomer.location && globalState.restaurantCustomer.location.latitude && globalState.restaurantCustomer.location.longitude) {
            isNearRestaurant(globalState.restaurantCustomer.location.latitude, globalState.restaurantCustomer.location.longitude, enqueueSnackbar)
                .then(async (nearRestaurant) => {
                    if (nearRestaurant) {
                        await updateOrderAPI(match.params.restaurantid, match.params.tableid, TableStatus.payment, enqueueSnackbar);
                        history.goBack();
                    } else {
                        enqueueSnackbar('Seems like you are not at the restaurant. Please order while you are at the restaurant.', { variant: 'error' });
                    }
                })
                .catch(() => {
                });
        }
    };

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
                    updateOrderHandler();
                }}
            >
                Ready For Payment?
            </Button>
        </div>
    );
};

OrderFooter.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(OrderFooter));
