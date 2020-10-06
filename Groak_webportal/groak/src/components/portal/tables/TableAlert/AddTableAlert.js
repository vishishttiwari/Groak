/**
 * This component is used to represent the add table alert pop up
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CloseRounded } from '@material-ui/icons';
import { AddTableMessage } from '../../../../catalog/Comments';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
import { DemoTableName } from '../../../../catalog/Demo';

const AddTableAlert = (props) => {
    const { open, addHandler, closeHandler, classes } = props;
    const [name, setName] = useState('');

    /**
     * This function is called when the add button is pressed. This adds
     * the table and also deletes whatever is written in the text field
     */
    function addButtonHandler() {
        addHandler(name);
        setName('');
    }

    /**
     * This function is called when the cancel button is pressed. This
     * table deletes whatever is written in the text field
     */
    function cancelButtonHandler() {
        setName('');
        closeHandler();
    }

    return (
        <Dialog className="pop-up-after-restaurant" open={open} onClose={closeHandler}>
            <div className="pop-up-after-restaurant-title">
                <p>Add Table</p>
                <IconButton onClick={closeHandler}>
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
            <DialogContent>
                <DialogContentText>
                    {AddTableMessage}
                </DialogContentText>
                <TextField
                    autoFocus
                    type="text"
                    margin="normal"
                    label="Table Name"
                    value={name}
                    onChange={(event) => { setName(event.target.value); }}
                    placeholder={DemoTableName}
                    fullWidth
                    required
                    InputLabelProps={textFieldLabelProps(classes)}
                />
            </DialogContent>
            <DialogActions className="table-alert-buttons">
                <Button className="table-alert-button" onClick={cancelButtonHandler} variant="outlined">
                    Cancel
                </Button>
                <Button className="table-alert-button" disabled={name.length === 0} onClick={addButtonHandler} variant="outlined">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AddTableAlert.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    addHandler: PropTypes.func.isRequired,
    closeHandler: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(AddTableAlert));
