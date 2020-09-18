/**
 * Veg non veg symbol
 */
import PropTypes from 'prop-types';
import React from 'react';
import './css/CustomerVegSymbol.css';

const CustomerVegSymbol = (props) => {
    const { symbol, color } = props;

    const colorClassName = () => {
        if (color === 'green') {
            return 'veg-symbol-green';
        } if (color === 'blue') {
            return 'veg-symbol-blue';
        } if (color === 'theme') {
            return 'veg-symbol-theme';
        }
        return 'veg-symbol-theme';
    };

    return (
        <div className="veg-symbol">
            <p className={colorClassName()}>{symbol}</p>
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
