import React from 'react';
import PropTypes from 'prop-types';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { withRouter } from 'react-router-dom';

const ReceiptHeader = (props) => {
    const { history, tableReceipt, setState } = props;

    const handleOrder = (event, receipt) => {
        setState({ type: 'setReceipt', tableReceipt: receipt });
    };

    return (
        <div className="header">
            <KeyboardBackspaceIcon
                className="header-left-icon"
                onClick={() => { history.goBack(); }}
            />
            <div className="header-content">
                <p className="header-title">{tableReceipt === 'table_receipt' ? 'Table Receipt' : 'Your Receipt'}</p>
            </div>
            <ToggleButtonGroup
                className="header-toggle-group"
                color="primary"
                value={tableReceipt}
                exclusive
                onChange={handleOrder}
                aria-label="text alignment"
            >
                <ToggleButton className="header-toggle" value="table_receipt" aria-label="table receipt">
                    Table Receipt
                </ToggleButton>
                <ToggleButton className="header-toggle" value="your_receipt" aria-label="your receipt">
                    Your Receipt
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

ReceiptHeader.propTypes = {
    history: PropTypes.object.isRequired,
    tableReceipt: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(ReceiptHeader));
