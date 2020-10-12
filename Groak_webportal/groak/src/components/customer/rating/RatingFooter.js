/**
 * This class is used as footer of rating screen
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';

const RatingFooter = (props) => {
    const { submitFeedback } = props;

    return (
        <div className="footer">
            <Button
                variant="contained"
                className="footer-button-custom"
                onClick={() => {
                    submitFeedback();
                }}
            >
                Submit
            </Button>
        </div>
    );
};

RatingFooter.propTypes = {
    submitFeedback: PropTypes.func.isRequired,
};

export default React.memo(RatingFooter);
