/**
 * This component is used for loading spinner all through the project
 */
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../../../globalCSS/_globalCSS.scss';

const Spinner = (props) => {
    const { show, size } = props;
    return (
        <CircularProgress
            className="spinner"
            variant="indeterminate"
            size={size}
            thickness={2}
            style={{
                display: (show ? 'block' : 'none'),
                color: styles.primaryColor,
                marginTop: styles.margin,
                marginBottom: styles.margin,
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
        />
    );
};

Spinner.propTypes = {
    show: PropTypes.bool.isRequired,
    size: PropTypes.number,
};

Spinner.defaultProps = {
    size: 100,
};

export default Spinner;
