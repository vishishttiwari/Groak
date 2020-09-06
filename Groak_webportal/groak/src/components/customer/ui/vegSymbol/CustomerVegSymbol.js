import PropTypes from 'prop-types';
import React from 'react';
import './css/CustomerVegSymbol.css';

const CustomerVegSymbol = (props) => {
    const { symbol, color } = props;

    return (
        <div className="veg-symbol">
            <p className={color === 'green' ? 'veg-symbol-green' : 'veg-symbol-theme'}>{symbol}</p>
        </div>
    );
};

CustomerVegSymbol.propTypes = {
    symbol: PropTypes.string.isRequired,
    color: PropTypes.string,
};

CustomerVegSymbol.defaultProps = {
    color: 'theme',
};

export default React.memo(CustomerVegSymbol);
