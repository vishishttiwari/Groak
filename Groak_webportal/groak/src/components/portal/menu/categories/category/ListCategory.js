/**
 * This component is used to represent each category row in categories in edit mode
 */

import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button, TextField } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useSnackbar } from 'notistack';

import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import { NoCategoryTitle } from '../../../../../catalog/NotificationsComments';
import { updateCategoryAPI } from '../CategoriesAPICalls';
import { DemoCategoryName } from '../../../../../catalog/Demo';
import Spinner from '../../../../ui/spinner/Spinner';

const initialState = {
    changed: false,
    categoryItem: {},
    loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'setEverything':
            return { ...state,
                categoryItem: action.categoryItem,
                loadingSpinner: false };
        case 'setName':
            return { ...state, categoryItem: { ...state.categoryItem, name: action.name }, changed: true };
        case 'setChanged':
            return { ...state, changed: action.changed };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const ListCategory = (props) => {
    const { restaurantId, categoryItem, clickHandler, checked, addToCheckedCategory } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setState({ type: 'setEverything', categoryItem });
    }, []);

    const saveUpdate = async () => {
        if (!state.categoryItem || !state.categoryItem.name || state.categoryItem.name.length <= 0) {
            enqueueSnackbar(NoCategoryTitle, { variant: 'error' });
            return;
        }
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        await updateCategoryAPI(restaurantId, categoryItem.id, { name: state.categoryItem.name }, enqueueSnackbar);
        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        setState({ type: 'setChanged', changed: false });
    };

    return (
        <>
            {!state.loadingSpinner ? (
                <TableRow
                    className="category-item-list-view-row"
                    onClick={clickHandler}
                >
                    <TableCell style={{ minWidth: '200px' }} component="th" scope="row">
                        <TextField
                            title="Category Name"
                            label="Category Name"
                            type="text"
                            value={state.categoryItem.name}
                            placeholder={`Ex: ${DemoCategoryName}`}
                            fullWidth
                            variant="outlined"
                            required
                            multiline
                            onChange={(event) => {
                                event.stopPropagation();
                                setState({ type: 'setName', name: event.target.value });
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                    </TableCell>
                    <TableCell style={{ minWidth: '150px' }} align="center">
                        {state.categoryItem && state.categoryItem.dishes ? `Includes ${state.categoryItem.dishes.length} ${state.categoryItem.dishes.length <= 1 ? 'dish' : 'dishes'} ` : ''}
                    </TableCell>
                    <TableCell align="center">
                        <Button
                            variant="contained"
                            style={{ minWidth: '100px', fontSize: '12px', margin: '5px auto' }}
                            className="success-buttons buttons"
                            disabled={!state.changed}
                            disableElevation
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            onClick={(event) => {
                                event.stopPropagation();
                                saveUpdate();
                            }}
                        >
                            Save
                        </Button>
                    </TableCell>
                    <TableCell align="center">
                        <Checkbox
                            className="check-box"
                            icon={<CheckBoxOutlineBlank fontSize="large" />}
                            checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                            checked={checked}
                            onChange={() => { addToCheckedCategory(state.categoryItem.id); }}
                            onClick={(event) => { event.stopPropagation(); }}
                        />
                    </TableCell>
                </TableRow>
            ) : (
                <TableRow>
                    <TableCell component="th" scope="row">
                    </TableCell>
                    <TableCell scope="row">
                        <Spinner size={16} show />
                    </TableCell>
                    <TableCell scope="row">
                    </TableCell>
                    <TableCell scope="row">
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

ListCategory.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    categoryItem: PropTypes.object.isRequired,
    clickHandler: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    addToCheckedCategory: PropTypes.func.isRequired,
};

export default React.memo(ListCategory);
