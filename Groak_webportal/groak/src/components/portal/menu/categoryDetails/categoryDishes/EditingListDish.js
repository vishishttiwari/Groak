/**
 * This component is used to represent each dish card in dishes
 */

import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, InputAdornment, Checkbox } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useSnackbar } from 'notistack';

import { AttachMoney, CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import NoImage from '../../../../../assets/icons/camera.png';
import { getImageLink } from '../../../../../catalog/Others';
import { DemoDishName, DemoDishPrice } from '../../../../../catalog/Demo';

import Spinner from '../../../../ui/spinner/Spinner';
import { InvalidDishPrice, NoDishTitle } from '../../../../../catalog/NotificationsComments';
import { updateDishAPI } from '../../dishes/DishesAPICalls';

const initialState = {
    changed: false,
    image: { file: null, link: '' },
    dishItem: {},
    loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'setEverything':
            return { ...state,
                dishItem: action.dishItem,
                image: action.dishItem.image ? { file: null, link: action.dishItem.image } : { file: null, link: '' },
                loadingSpinner: false };
        case 'setName':
            return { ...state, dishItem: { ...state.dishItem, name: action.name }, changed: true };
        case 'setPrice':
            return { ...state, dishItem: { ...state.dishItem, price: action.price }, changed: true };
        case 'removeImage':
            return { ...state, image: { file: null, link: '' }, changed: true };
        case 'setImage':
            return { ...state, image: action.image, changed: true };
        case 'setShortInfo':
            return { ...state, dishItem: { ...state.dishItem, shortInfo: action.shortInfo }, changed: true };
        case 'setChanged':
            return { ...state, changed: action.changed };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const EditingListDish = (props) => {
    const { restaurantId, dishItem, dishDetailHandler, checked, addToCheckedDish } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setState({ type: 'setEverything', dishItem });
    }, []);

    const addImage = (event) => {
        setState({ type: 'setImage', image: { file: event.target.files[0], link: URL.createObjectURL(event.target.files[0]) } });
    };

    const saveUpdate = async () => {
        if (!state.dishItem || !state.dishItem.name || state.dishItem.name.length <= 0) {
            enqueueSnackbar(NoDishTitle, { variant: 'error' });
            return;
        }
        if (!state.dishItem || state.dishItem.price === null || state.dishItem.price < 0) {
            enqueueSnackbar(InvalidDishPrice, { variant: 'error' });
            return;
        }
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        await updateDishAPI(restaurantId, dishItem.id, { name: state.dishItem.name, price: parseFloat(state.dishItem.price), shortInfo: state.dishItem.shortInfo, image: state.image }, enqueueSnackbar);
        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        setState({ type: 'setChanged', changed: false });
    };

    return (
        <>
            {!state.loadingSpinner ? (
                <TableRow
                    className="dish-item-list-view-row"
                    onClick={() => {
                        dishDetailHandler(state.dishItem.id);
                    }}
                >
                    <TableCell className="dish-item-list-view-row-cell-width-twohundred" component="th" scope="row">
                        <TextField
                            title="Dish Name"
                            label="Dish Name"
                            type="text"
                            value={state.dishItem.name}
                            placeholder={`Ex: ${DemoDishName}`}
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
                    <TableCell className="dish-item-list-view-row-cell-width-twohundred" align="center">
                        <TextField
                            title="Price"
                            label="Price"
                            type="number"
                            value={state.dishItem.price}
                            placeholder={`Ex: ${DemoDishPrice}`}
                            fullWidth
                            variant="outlined"
                            error={(parseFloat(state.dishItem.price) < 0)}
                            required
                            InputProps={({ inputProps: { min: 0 }, startAdornment: (<InputAdornment position="start"><AttachMoney /></InputAdornment>) })}
                            onChange={(event) => {
                                event.stopPropagation();
                                setState({ type: 'setPrice', price: event.target.value });
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                    </TableCell>
                    <TableCell className="dish-item-list-view-row-cell-width-hundredfifty" align="center">
                        <img className="dish-item-list-view-row-image" src={state.image.link ? getImageLink(state.image.link) : NoImage} alt={state.name || 'Dish Image'} />
                    </TableCell>
                    <TableCell className="dish-item-list-view-row-cell-width-fivehundred" align="center">
                        <TextField
                            rows="4"
                            title="Short Info"
                            label="Short Info"
                            type="text"
                            value={state.dishItem.shortInfo}
                            fullWidth
                            variant="outlined"
                            required={false}
                            multiline
                            onChange={(event) => {
                                event.stopPropagation();
                                setState({ type: 'setShortInfo', shortInfo: event.target.value });
                            }}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                    </TableCell>
                    <TableCell className="dish-item-list-view-row-buttons dish-item-list-view-row-cell-width-hundred" align="center">
                        <input
                            accept="image/*"
                            id={`icon-button-photo-${state.dishItem.id}`}
                            onChange={addImage}
                            type="file"
                            style={{ display: 'none' }}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        />
                        <label htmlFor={`icon-button-photo-${state.dishItem.id}`}>
                            <Button
                                variant="contained"
                                className="normal-buttons buttons dish-item-list-view-row-button"
                                component="span"
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                Upload Image
                            </Button>
                        </label>
                        <Button
                            variant="contained"
                            className="normal-buttons buttons dish-item-list-view-row-button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setState({ type: 'removeImage' });
                            }}
                        >
                            Delete Image
                        </Button>
                        <Button
                            variant="contained"
                            style={{ minWidth: '100px', fontSize: '12px', margin: '5px auto' }}
                            className="success-buttons buttons dish-item-list-view-row-button"
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
                    <TableCell className="dish-item-list-view-row-cell-width-fifty" align="center">
                        <Checkbox
                            className="check-box"
                            icon={<CheckBoxOutlineBlank fontSize="large" />}
                            checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                            checked={checked}
                            onChange={(event) => { addToCheckedDish(event, state.dishItem.reference.path); }}
                            onClick={(event) => { event.stopPropagation(); }}
                        />
                    </TableCell>
                </TableRow>
            ) : (
                <TableRow>
                    <TableCell component="th" scope="row">
                    </TableCell>
                    <TableCell scope="row">
                    </TableCell>
                    <TableCell scope="row">
                        <Spinner size={130} show />
                    </TableCell>
                    <TableCell scope="row">
                    </TableCell>
                    <TableCell scope="row">
                    </TableCell>
                    <TableCell>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

EditingListDish.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    dishItem: PropTypes.object.isRequired,
    dishDetailHandler: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    addToCheckedDish: PropTypes.func.isRequired,
};

export default React.memo(EditingListDish);
