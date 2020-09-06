import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import CustomerTopic from '../topic/CustomerTopic';

const CustomerSpecialInstructions = (props) => {
    const { helperText } = props;

    return (
        <>
            <CustomerTopic header="Special Instructions" />
            <TextField
                className="special-instrictions-textfield"
                style={{ backgroundColor: 'white',
                    padding: '0 20px',
                    width: '100%',
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: 'silver' }}
                id="standard-multiline-static"
                multiline
                rows={4}
                helperText={helperText}
            />
        </>
    );
};

CustomerSpecialInstructions.propTypes = {
    helperText: PropTypes.string.isRequired,
};

export default React.memo(CustomerSpecialInstructions);
