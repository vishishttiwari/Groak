import React from 'react';
import PropTypes from 'prop-types';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const OrderHeader = (props) => {
    const { tableOrder, setState } = props;

    const handleOrder = (event, order) => {
        setState({ type: 'setOrder', tableOrder: order });
    };

    return (
        <div className="header">
            <div className="header-content">
                <p className="header-title">{tableOrder === 'table_order' ? 'Table Order' : 'Your Order'}</p>
            </div>
            <ToggleButtonGroup
                className="header-toggle-group"
                color="primary"
                value={tableOrder}
                exclusive
                onChange={handleOrder}
                aria-label="text alignment"
            >
                <ToggleButton className="header-toggle" value="table_order" aria-label="table order">
                    Table Order
                </ToggleButton>
                <ToggleButton className="header-toggle" value="your_order" aria-label="your order">
                    Your Order
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};

OrderHeader.propTypes = {
    tableOrder: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(OrderHeader);
