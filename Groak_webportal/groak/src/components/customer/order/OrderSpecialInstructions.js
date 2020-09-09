/**
 * Used for representing special instructions in order
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from '@material-ui/core';
import CustomerTopic from '../ui/topic/CustomerTopic';

const CustomerSpecialInstructions = (props) => {
    const { helperText, specialInstructions, setState, addToOrderHandler } = props;

    return (
        <>
            <CustomerTopic header="Special Instructions" />
            <div style={{
                backgroundColor: 'white',
                paddingBottom: '10px',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: 'silver' }}
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
                <Button
                    style={{
                        display: 'flex',
                        marginTop: '10px',
                        marginLeft: 'auto',
                        marginRight: '20px',
                        marginBottom: '10x' }}
                    color="primary"
                    variant="outlined"
                    onClick={() => { addToOrderHandler(); }}
                >
                    Send
                </Button>
            </div>
        </>
    );
};

CustomerSpecialInstructions.propTypes = {
    specialInstructions: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    addToOrderHandler: PropTypes.func.isRequired,
    helperText: PropTypes.string.isRequired,
};

export default React.memo(CustomerSpecialInstructions);
