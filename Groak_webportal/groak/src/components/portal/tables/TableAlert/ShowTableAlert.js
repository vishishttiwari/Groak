/**
 * This component is used to represent the show table alert pop up
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, TextField, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
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
    const { history, classes, open, tableId, deleteHandler, updateHandler, closeHandler } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchTable() {
            await fetchTableAPI(globalState.restaurantIdPortal, tableId, setState, enqueueSnackbar);
        }
        if (open && tableId.length !== 0) {
            setState({ type: 'error' });
            fetchTable();
        }
    }, [open, globalState.restaurantIdPortal, tableId, enqueueSnackbar]);

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
            pathname: `/qrmenupage/${tableId}`,
            search: `?table=${encodeURIComponent(state.initialName)}`,
        });
    }

    return (
        <Dialog className="pop-up-after-restaurant" open={open} onClose={closeHandler}>
            <div className="pop-up-after-restaurant-title">
                <p>{(state.initialName) || 'Loading'}</p>
                <IconButton onClick={closeHandler}>
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
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
                    QR Code
                </Button>
                <Button className="table-alert-button" onClick={() => { updateHandler(state.table); }} variant="outlined" disabled={!state.table}>
                    Update
                </Button>
                <Button style={{ color: 'red' }} className="table-alert-button" onClick={() => { deleteHandler(state.table); }} variant="outlined" disabled={!state.table}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ShowTableAlert.propTypes = {
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    tableId: PropTypes.string.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    updateHandler: PropTypes.func.isRequired,
    closeHandler: PropTypes.func.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(ShowTableAlert)));
