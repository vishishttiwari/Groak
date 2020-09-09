/**
 * Text field and topic for special instructions
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import CustomerTopic from '../topic/CustomerTopic';

const CustomerSpecialInstructions = (props) => {
    const { helperText, specialInstructions, setState } = props;

    return (
        <>
            <CustomerTopic header="Special Instructions" />
            <div style={{
                backgroundColor: 'white',
                paddingBottom: '20px',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: 'silver',
            }}
            >
                <TextField
                    value={specialInstructions}
                    onChange={(event) => { setState({ type: 'setSpecialInstructions', specialInstructions: event.target.value }); }}
                    style={{
                        display: 'flex',
                        margin: 'auto',
                        width: '90%',
                    }}
                    id="standard-multiline-static"
                    multiline
                    rows={5}
                    placeholder={helperText}
                />
            </div>
        </>
    );
};

CustomerSpecialInstructions.propTypes = {
    specialInstructions: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    helperText: PropTypes.string.isRequired,
};

export default React.memo(CustomerSpecialInstructions);
