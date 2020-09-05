/**
 * This class is part of Dish Details that is used for displaying the extras for a dish.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { TextField } from '@material-ui/core';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../../catalog/Others';
import { EmptyDishExtrasMinOptions, EmptyDishExtrasMaxOptions } from '../../../../../catalog/NotificationsComments';

const DishExtrasMultipleSelectionInformation = (props) => {
    const { classes, extras, setState, extra, index } = props;

    /**
     * This function is called when the minimum options required text field is altered
     *
     * @param {*} event this is the number enetred in the text field
     */
    const changeMinSelectionHandler = (event) => {
        const updatedExtras = [...extras];
        updatedExtras[index].minOptionsSelect = event.target.value;
        if (!updatedExtras[index].maxOptionsSelect || parseFloat(updatedExtras[index].maxOptionsSelect) < parseFloat(updatedExtras[index].minOptionsSelect)) {
            updatedExtras[index].maxOptionsSelect = (parseFloat(event.target.value) + 1).toString();
        }
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    /**
     * This function is called when the maximum options required text field is altered
     *
     * @param {*} event this is the number enetred in the text field
     */
    const changeMaxSelectionHandler = (event) => {
        const updatedExtras = [...extras];
        updatedExtras[index].maxOptionsSelect = event.target.value;
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    return (
        !extra.multipleSelections ? null : (
            <div className="dish-extras-multiple-selection-information">
                <TextField
                    label="Minimum options required:"
                    type="number"
                    value={extra.minOptionsSelect}
                    onChange={changeMinSelectionHandler}
                    margin="normal"
                    fullWidth
                    helperText={EmptyDishExtrasMinOptions}
                    variant="outlined"
                    InputLabelProps={textFieldLabelProps(classes)}
                />
                <TextField
                    label="Maximum options allowed:"
                    type="number"
                    value={extra.maxOptionsSelect}
                    onChange={changeMaxSelectionHandler}
                    margin="normal"
                    fullWidth
                    helperText={EmptyDishExtrasMaxOptions}
                    variant="outlined"
                    InputLabelProps={textFieldLabelProps(classes)}
                />
            </div>
        )
    );
};

DishExtrasMultipleSelectionInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    extras: PropTypes.array.isRequired,
    setState: PropTypes.func.isRequired,
    extra: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(DishExtrasMultipleSelectionInformation));
