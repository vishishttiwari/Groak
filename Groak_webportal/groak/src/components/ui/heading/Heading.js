/**
 * This component is used for headings in all the components
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';

import './css/Heading.css';

const Heading = (props) => {
    const { heading, buttonName, onClick } = props;
    return (
        <div className="heading">
            <h1>{heading}</h1>
            {buttonName ? (
                <Button
                    className="button"
                    onClick={onClick}
                >
                    {buttonName}
                </Button>
            ) : null}
        </div>
    );
};

Heading.propTypes = {
    heading: PropTypes.string,
    buttonName: PropTypes.string,
    onClick: PropTypes.func,
};

Heading.defaultProps = {
    heading: '',
    buttonName: null,
    onClick: (() => {}),
};

export default Heading;
