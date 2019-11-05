/**
 * This component is used to represent the show table alert pop up
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import { context } from '../../../../globalState/globalState';

import { fetchTableAPI } from '../TablesAPICalls';
import { ShowTableMessage } from '../../../../catalog/Comments';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
import { DemoTableName } from '../../../../catalog/Demo';

const initialState = { table: null, initialName: '' };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchTable':
            return { ...state, table: action.table, initialName: action.initialName };
        case 'setTable':
            return { ...state, table: action.table };
        default:
            return initialState;
    }
}

const ShowTableAlert = (props) => {
    const { classes, open, tableId, deleteHandler, updateHandler, closeHandler, history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchTable() {
            await fetchTableAPI(globalState.restaurantId, tableId, setState, enqueueSnackbar);
        }
        if (open && tableId.length !== 0) {
            setState({ type: 'error' });
            fetchTable();
        }
    }, [open, globalState.restaurantId, tableId, enqueueSnackbar]);

    /**
     * This function is called when the name is changed
     *
     * @param {*} event this contains the data present in the text field
     */
    const onChangeHandler = (event) => {
        const newTable = { ...state.table };
        newTable.name = event.target.value;
        setState({ type: 'setTable', table: newTable });
    };

    /**
     * This function is called when the qr button is pressed for a table
     */
    function qrCodeHandler() {
        history.push({
            pathname: `/qrcode/${tableId}`,
            search: `?table=${encodeURIComponent(state.initialName)}`,
        });
    }

    return (
        <Dialog open={open} onClose={closeHandler}>
            <DialogTitle>
                {(state.initialName) || 'Loading'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {ShowTableMessage}
                </DialogContentText>
                <TextField
                    autoFocus
                    type="text"
                    margin="normal"
                    label="Table Name"
                    value={(state.table && state.table.name) ? state.table.name : ''}
                    onChange={onChangeHandler}
                    placeholder={DemoTableName}
                    fullWidth
                    required
                    InputLabelProps={textFieldLabelProps(classes)}
                />
            </DialogContent>
            <DialogActions className="table-alert-buttons">
                <Button className="table-alert-button" onClick={closeHandler} variant="outlined">
                    Cancel
                </Button>
                <Button className="table-alert-button" onClick={qrCodeHandler} variant="outlined" disabled={!state || !state.initialName || state.initialName.length === 0}>
                    Barcode
                </Button>
                <Button className="table-alert-button" onClick={() => { updateHandler(state.table); }} variant="outlined" disabled={!state.table || !state.table.name || state.table.name.length === 0}>
                    Update
                </Button>
                <Button className="table-alert-button" onClick={() => { deleteHandler(state.table); }} variant="outlined" disabled={!state.table} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ShowTableAlert.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    tableId: PropTypes.string.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    updateHandler: PropTypes.func.isRequired,
    closeHandler: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(ShowTableAlert)));
