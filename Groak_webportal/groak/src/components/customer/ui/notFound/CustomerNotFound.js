import React from 'react';
import PropTypes from 'prop-types';
import Empty from '../../../../assets/others/empty.png';

const CustomerNotFound = (props) => {
    const { text } = props;

    return (
        <div className="not-found">
            <p className="not-found-text">{text}</p>
            <img className="not-found-image" draggable="false" src={Empty} alt={text} />
        </div>
    );
};

CustomerNotFound.propTypes = {
    text: PropTypes.string.isRequired,
};

export default React.memo(CustomerNotFound);
