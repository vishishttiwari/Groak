/**
 * Topic for any screen in all customers interface
 */
import React from 'react';
import PropTypes from 'prop-types';
import './css/CustomerTopic.css';

const CustomerTopic = (props) => {
    const { header, subheader, highlightText } = props;

    const highlightHeader = () => {
        if (highlightText.length > 0) {
            return (
                <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: header.replace(new RegExp(`\\b${highlightText}`, 'gi'), (match) => { return `<mark>${match}</mark>`; }),
                    }}
                />
            );
        }
        return header;
    };

    return (
        <div className="topic">
            <p className="topic-header">{highlightHeader()}</p>
            {subheader ? (<p className="topic-subheader">{subheader}</p>) : null}
        </div>
    );
};

CustomerTopic.propTypes = {
    header: PropTypes.string.isRequired,
    subheader: PropTypes.string,
    highlightText: PropTypes.string,
};

CustomerTopic.defaultProps = {
    subheader: '',
    highlightText: '',
};

export default React.memo(CustomerTopic);
