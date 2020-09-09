/**
 * Used for representing any info as table cell with white background border etc.
 */
import React from 'react';
import PropTypes from 'prop-types';
import './css/CustomerInfo.css';

const CustomerInfo = (props) => {
    const { info } = props;

    return (
        <div className="info">
            <p className="info-info">
                {info}
            </p>
        </div>
    );
};

CustomerInfo.propTypes = {
    info: PropTypes.string.isRequired,
};

export default React.memo(CustomerInfo);
