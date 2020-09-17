/**
 * This class is part of the settings page that shows tips information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, InputAdornment } from '@material-ui/core';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../catalog/Others';

const Tips = (props) => {
    const { classes, value0, value1, value2, setState } = props;

    return (
        <div className="restaurant-settings-payment">
            <p>Tips:</p>
            <TextField
                label="Value:"
                type="number"
                placeholder="Ex: 20"
                value={value0}
                onChange={(event) => { setState({ type: 'setTips', index: 0, value: event.target.value }); }}
                margin="normal"
                error={value0 <= 0}
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
            />
            <TextField
                label="Value:"
                type="number"
                placeholder="Ex: 20"
                value={value1}
                onChange={(event) => { setState({ type: 'setTips', index: 1, value: event.target.value }); }}
                margin="normal"
                error={value1 <= 0}
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
            />
            <TextField
                label="Value:"
                type="number"
                placeholder="Ex: 20"
                value={value2}
                onChange={(event) => { setState({ type: 'setTips', index: 2, value: event.target.value }); }}
                margin="normal"
                error={value2 <= 0}
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
            />
        </div>
    );
};

Tips.propTypes = {
    classes: PropTypes.object.isRequired,
    value0: PropTypes.number.isRequired,
    value1: PropTypes.number.isRequired,
    value2: PropTypes.number.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(Tips));
