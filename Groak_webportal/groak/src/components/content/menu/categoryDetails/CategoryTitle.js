/**
 * This componnet is used to represent the start time and end time in categories details
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { TextField } from '@material-ui/core';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
import { NoCategoryTitle } from '../../../../catalog/NotificationsComments';
import { DemoCategoryName } from '../../../../catalog/Demo';

const CategoryTitle = (props) => {
    const { classes, checkFields, name, setState } = props;

    return (
        <div className="category-title">
            <h2>Dish Title:</h2>
            <TextField
                label="Title"
                type="text"
                autoFocus
                placeholder={`Ex: ${DemoCategoryName}`}
                value={name}
                onChange={(event) => { setState({ type: 'setName', name: event.target.value }); }}
                margin="normal"
                fullWidth
                required
                helperText={checkFields ? NoCategoryTitle : null}
                error={(name.length <= 0) && checkFields}
                shrink={(name.length > 0).toString()}
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
            />
        </div>
    );
};

CategoryTitle.propTypes = {
    classes: PropTypes.object.isRequired,
    checkFields: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(CategoryTitle));
