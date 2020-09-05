import React from 'react';
import PropTypes from 'prop-types';
import './css/CustomerTopic.css';

const CustomerTopic = (props) => {
    const { header, subheader } = props;

    return (
        <div className="topic">
            <p className="topic-header">{header}</p>
            {subheader ? (<p className="topic-subheader">{subheader}</p>) : null}
        </div>
    );
};

CustomerTopic.propTypes = {
    header: PropTypes.string.isRequired,
    subheader: PropTypes.string,
};

CustomerTopic.defaultProps = {
    subheader: '',
};

export default React.memo(CustomerTopic);
