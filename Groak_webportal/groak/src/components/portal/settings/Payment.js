/**
 * This class is part of the settings page that shows payments information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Delete } from '@material-ui/icons';
import { Button, Select, TextField, OutlinedInput, InputAdornment } from '@material-ui/core';
import { uploadButtonStyle, TextFieldLabelStyles, textFieldLabelProps } from '../../../catalog/Others';

const Payment = (props) => {
    const { classes, title, percentage, value, index, setState } = props;

    return (
        <div className="restaurant-settings-payment">
            <Button
                className="delete"
                variant="contained"
                onClick={() => { setState({ type: 'deletePayment', index }); }}
            >
                Delete
                <Delete className={uploadButtonStyle().rightIcon} />
            </Button>
            <TextField
                label="Title:"
                type="text"
                placeholder="Ex: Sales Tax"
                value={title}
                onChange={(event) => { setState({ type: 'setPaymentTitle', index, title: event.target.value }); }}
                margin="normal"
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <Select
                native
                value={percentage}
                onChange={(event) => { setState({ type: 'setPaymentPercentage', index, percentage: event.target.value }); }}
                input={<OutlinedInput />}
            >
                <option value>Percentage</option>
                <option value={false}>Absolute</option>
            </Select>
            <TextField
                label="Value:"
                type="number"
                placeholder="Ex: 9"
                value={value}
                onChange={(event) => { setState({ type: 'setPaymentValue', index, value: event.target.value }); }}
                margin="normal"
                error={value <= 0}
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">{percentage ? '%' : '$'}</InputAdornment>,
                }}
            />
        </div>
    );
};

Payment.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    percentage: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(Payment));
