/**
 * This class is part of Dish Details that is used for displaying the extras for a dish.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Delete } from '@material-ui/icons';
import { Select, Button, TextField, OutlinedInput } from '@material-ui/core';
import { uploadButtonStyle, TextFieldLabelStyles, textFieldLabelProps } from '../../../../../catalog/Others';
import { DemoDishExtraTitle } from '../../../../../catalog/Demo';
import { InvalidDishExtrasTitle } from '../../../../../catalog/NotificationsComments';

const DishExtrasMainInformation = (props) => {
    const { classes, checkFields, extras, setState, extra, index } = props;

    /**
     * This function is called when an extra has to be deleted
     */
    const deleteDishExtrasHandler = () => {
        const updatedExtras = [...extras];
        updatedExtras.splice(index, 1);
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    /**
     * This function is called when the title is changed
     *
     * @param {*} event this sends the title entered in the textfield
     */
    const changeTitleHandler = (event) => {
        const updatedExtras = [...extras];
        updatedExtras[index].title = event.target.value;
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    /**
     * This function is called when the select is changed
     *
     * @param {*} event this sends the multiple selections select
     */
    const changeMultipleSelectionHandler = (event) => {
        const updatedExtras = [...extras];
        updatedExtras[index].multipleSelections = event.target.value === 'true';
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    return (
        <div className="dish-extras-main-information">
            <Button
                className="delete"
                variant="contained"
                onClick={deleteDishExtrasHandler}
            >
                Delete
                <Delete className={uploadButtonStyle().rightIcon} />
            </Button>
            <TextField
                label="Title:"
                type="text"
                placeholder={`Ex: ${DemoDishExtraTitle}`}
                value={extra.title}
                onChange={changeTitleHandler}
                margin="normal"
                helperText={extra.title.length <= 0 && checkFields ? InvalidDishExtrasTitle : null}
                error={checkFields && extra.title.length <= 0}
                fullWidth
                variant="outlined"
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <p>Multiple Selections Allowed?</p>
            <Select
                native
                fullWidth
                value={extra.multipleSelections}
                onChange={changeMultipleSelectionHandler}
                input={<OutlinedInput />}
            >
                <option value>Yes</option>
                <option value={false}>No</option>
            </Select>
        </div>
    );
};

DishExtrasMainInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    checkFields: PropTypes.bool.isRequired,
    extras: PropTypes.array.isRequired,
    setState: PropTypes.func.isRequired,
    extra: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(DishExtrasMainInformation));
