/**
 * This component is used for the dishes page
 */
import React, { useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import SearchBar from 'material-ui-search-bar';
import { Switch, Button, Checkbox } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { context } from '../../../../globalState/globalState';

import './css/Dishes.css';
import { fetchDishesAPI, changeAvailabilityOfDishAPI, changeDishOrderAPI, deleteSelectedDishesAPI } from './DishesAPICalls';
import Dish from './dish/Dish';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoDishes, DishOrder, DishesNotFound } from '../../../../catalog/Comments';
import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';
import Empty from '../../../../assets/others/empty.png';
import ListDish from './dish/ListDish';
import DishModificationPopUp from './DishModificationPopUp';
import AddDishes from './AddDishes';
import { DeleteDishesPopUp, DeleteDishesPopUpTitle } from '../../../../catalog/NotificationsComments';
import Decision from '../../../ui/decision/Decision';

const initialState = { deletePermission: false, dishes: [], popup: false, popupCategory: '', newDishes: [], checkAll: false, checkedDishes: [], searchField: '', editMode: false, changeOrder: false, loadingSpinner: true };

function reducer(state, action) {
    let newDishes;
    let newCheckedDishes;
    let index;
    switch (action.type) {
        case 'setDeletePermission':
            return { ...state, deletePermission: action.deletePermission };
        case 'fetchDishes':
            return { ...state, dishes: action.dishes, loadingSpinner: false };
        case 'setDishes':
            return { ...state, dishes: action.dishes, loadingSpinner: false };
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        case 'setChangeOrder':
            return { ...state, changeOrder: action.changeOrder };
        case 'addDish':
            return { ...state, newDishes: [...state.newDishes, {}] };
        case 'closeAddDish':
            return { ...state, newDishes: [] };
        case 'setEditMode':
            return { ...state, editMode: action.editMode, changeOrder: false };
        case 'appendCheckedDishes':
            return { ...state, checkedDishes: [...state.checkedDishes, action.dishId] };
        case 'setPopup':
            return { ...state, popup: action.popup, popupCategory: action.popupCategory };
        case 'removeCheckedDishes':
            newCheckedDishes = [...state.checkedDishes];
            index = newCheckedDishes.indexOf(action.dishId);
            if (index > -1) {
                newCheckedDishes.splice(index, 1);
            }
            return { ...state, checkedDishes: newCheckedDishes };
        case 'setCheckedDishes':
            return { ...state, checkedDishes: action.checkedDishes };
        case 'setCheckAll':
            return { ...state, checkAll: action.checkAll };
        case 'setName':
            newDishes = [...state.dishes];
            newDishes[action.index] = { ...newDishes[action.index], name: action.name };
            return { ...state, dishes: newDishes };
        case 'setPrice':
            newDishes = [...state.dishes];
            newDishes[action.index] = { ...newDishes[action.index], price: action.price };
            return { ...state, dishes: newDishes };
        case 'setShortInfo':
            return { ...state, dishes: { ...state.dishes[action.index], shortInfo: action.shortInfo } };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return initialState;
    }
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    table: {
        minWidth: 800,
    },
});

const Dishes = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    useEffect(() => {
        async function fetchDishes() {
            await fetchDishesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
        }
        fetchDishes();
    }, [globalState.restaurantIdPortal, enqueueSnackbar]);

    /**
     * This function is passed into the dish component which is called everytime
     * the available button is pressed
     *
     * @param {*} changedDish this is the dish for which availability is changed
     */
    const availableDishHandler = async (changedDish) => {
        await changeAvailabilityOfDishAPI(globalState.restaurantIdPortal, state.dishes, setState, changedDish, enqueueSnackbar);
    };

    /**
     * This function is called to add a dish. This function is passed to the heading
     */
    const addDishHandler = () => {
        if (state.editMode) {
            setState({ type: 'addDish' });
        } else {
            history.push('/dishes/addDish');
        }
    };

    /**
     * Function called when popup is supposed to be showed or hidden
     *
     * @param {*} popupCategory
     */
    const showPopUp = (popupCategory) => {
        if (state.popup) {
            setState({ type: 'setPopup', popup: false, popupCategory: '' });
        } else {
            setState({ type: 'setPopup', popup: true, popupCategory });
        }
    };

    /**
     * Function called when popup submitted
     */
    const popUpSubmit = async () => {
        if (state.popupCategory === 'info' || state.popupCategory === 'price') {
            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
            await fetchDishesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
        }
        setState({ type: 'setPopup', popup: false, popupCategory: '' });
    };

    /**
     * This function is called when the save button is clicked after adding
     */
    const completeAddingDish = async () => {
        setState({ type: 'closeAddDish' });
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        await fetchDishesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
    };

    /**
     * This function is called when each dish is pressed.
     *
     * @param {*} id this is the key of the dish that is passed
     */
    function dishDetailHandler(id) {
        history.push(`/dishes/${id}`);
    }

    /**
     * When check is pressed on any dish, this function is called
     *
     * @param {*} id
     */
    const addToCheckedDish = (id) => {
        if (!state.checkedDishes.includes(id)) {
            setState({ type: 'appendCheckedDishes', dishId: id });
        } else {
            setState({ type: 'removeCheckedDishes', dishId: id });
            setState({ type: 'setCheckAll', checkAll: false });
        }
    };

    /**
     * Called when all check on dishes are pressed
     */
    const addAllToCheckedDish = () => {
        if (!state.checkAll) {
            const checkedDishes = [];
            state.dishes.forEach((dish) => {
                if (!checkedDishes.includes(dish.id)) {
                    checkedDishes.push(dish.id);
                }
            });
            setState({ type: 'setCheckedDishes', checkedDishes });
            setState({ type: 'setCheckAll', checkAll: true });
        } else {
            setState({ type: 'setCheckedDishes', checkedDishes: [] });
            setState({ type: 'setCheckAll', checkAll: false });
        }
    };

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedDishes = arrayMove(state.dishes, oldIndex, newIndex);
            setState({ type: 'setDishes',
                dishes: updatedDishes,
            });
            await changeDishOrderAPI(globalState.restaurantIdPortal, updatedDishes.map((dish) => {
                return dish.reference;
            }), enqueueSnackbar);
        }
    };

    /**
     * This function decides if dish is visble after writing something up in the search bar
     *
     * @param {*} dish
     */
    const isDishVisible = (dish) => {
        if (!dish) { return false; }
        if (state.searchField.length <= 0) { return true; }
        if (dish.name && dish.name.toLowerCase().startsWith(state.searchField.toLowerCase())) { return true; }
        if (dish.name) {
            const dishName = dish.name.split(' ');
            for (let i = 0; i < dishName.length; i += 1) {
                if (dishName[i] && dishName[i].toLowerCase().startsWith(state.searchField.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * This function is called when order toggle is pressed
     *
     * @param {*} checked
     */
    const orderToggle = (checked) => {
        setState({ type: 'setChangeOrder', changeOrder: checked });
    };

    /**
     * This function is called when edit toggle is pressed
     *
     * @param {*} checked
     */
    const editToggle = (checked) => {
        setState({ type: 'setEditMode', editMode: checked });
    };

    /**
     * This function is called when delete button is called for selected dishes
     */
    const deleteSelectedDishes = async () => {
        setState({ type: 'setCheckedDishes', checkedDishes: [] });
        await deleteSelectedDishesAPI(globalState.restaurantIdPortal, state.checkedDishes, enqueueSnackbar);
        await fetchDishesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
        setState({ type: 'setEditMode', editMode: true });
        setState({ type: 'setCheckAll', checkAll: false });
    };

    const galleryView = () => {
        return (
            <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                <div className="dish-items">
                    {state.dishes.map((dish, index) => {
                        return (isDishVisible(dish)
                            ? (
                                <SortableItem key={dish.id} index={index} disabled={!state.changeOrder}>
                                    <Dish
                                        dishItem={dish}
                                        availableDishHandler={availableDishHandler}
                                        clickHandler={() => { dishDetailHandler(dish.id); }}
                                    />
                                </SortableItem>
                            ) : null
                        );
                    })}
                </div>
            </SortableList>
        );
    };

    const listView = () => {
        return (
            <div className="dish-items-list-view">
                <Paper className={classes.root}>
                    <TableContainer>
                        <Table className={classes.table} size="small" aria-label="dishes table">
                            <TableHead style={{ overflowX: 'scroll' }}>
                                <TableRow>
                                    <TableCell width="200px" className="dish-items-list-view-heading">Name</TableCell>
                                    <TableCell width="150px" className="dish-items-list-view-heading" align="center">Price</TableCell>
                                    <TableCell width="150px" className="dish-items-list-view-heading" align="center">Photo</TableCell>
                                    <TableCell width="500px" className="dish-items-list-view-heading" align="center">Description</TableCell>
                                    <TableCell width="100px" className="dish-items-list-view-heading" align="center">Actions</TableCell>
                                    <TableCell width="50px" className="dish-items-list-view-heading" align="center">
                                        <Checkbox
                                            className="check-box"
                                            icon={<CheckBoxOutlineBlank fontSize="large" />}
                                            checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                                            checked={state.checkAll}
                                            onChange={() => { addAllToCheckedDish(); }}
                                            onClick={(event) => { event.stopPropagation(); }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AddDishes restaurantId={globalState.restaurantIdPortal} completeAddingDish={completeAddingDish} />
                                {state.dishes.map((dish) => {
                                    return (isDishVisible(dish)
                                        ? (
                                            <ListDish
                                                key={dish.id}
                                                restaurantId={globalState.restaurantIdPortal}
                                                dishItem={dish}
                                                dishDetailHandler={dishDetailHandler}
                                                checked={state.checkedDishes.includes(dish.id)}
                                                addToCheckedDish={addToCheckedDish}
                                            />
                                        ) : null
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        );
    };

    /**
     * This function is called when the delete button is pressed
     *
     * @param {*} granted this tells if the user has granted permission to delete in the popup
     */
    const userPermissionResponse = (granted) => {
        if (granted) {
            deleteSelectedDishes();
        }
        setState({ type: 'setDeletePermission', deletePermission: false });
    };

    return (
        <div className="dishes">
            <Decision open={state.deletePermission} response={userPermissionResponse} title={DeleteDishesPopUpTitle} content={DeleteDishesPopUp} />
            <Heading heading="Dishes" buttonName={state.editMode ? '' : 'Add Dish'} onClick={addDishHandler} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    <SearchBar
                        className="search-bar"
                        value={state.searchField}
                        onChange={(newValue) => {
                            setState({ type: 'setSearchField', searchField: newValue });
                        }}
                    />
                    {state.dishes && state.dishes.length === 0 ? (
                        <>
                            <p className="text-on-background">{NoDishes}</p>
                            <div className="not-found">
                                <p className="not-found-text">{DishesNotFound}</p>
                                <img className="not-found-image" draggable="false" src={Empty} alt="No Categories" />
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{ marginBottom: 0 }} className="text-on-background">Switching in and out of edit mode may take few seconds</p>
                            <div className="order-change-toggle">
                                <Switch
                                    checked={state.editMode}
                                    size="medium"
                                    onChange={(event) => { editToggle(event.target.checked); }}
                                    name="edit"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    color="primary"
                                />
                                <p className="toggle-label">Edit Dishes</p>
                            </div>
                            {!state.editMode ? (
                                <>
                                    <p style={{ marginBottom: 0 }} className="text-on-background">{DishOrder}</p>
                                    <div className="order-change-toggle">
                                        <Switch
                                            checked={state.changeOrder}
                                            size="medium"
                                            onChange={(event) => { orderToggle(event.target.checked); }}
                                            name="changeOrder"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                            color="primary"
                                        />
                                        <p className="toggle-label">Change Order</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '12px', margin: '5px' }}
                                        className="cancel-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            setState({ type: 'setDeletePermission', deletePermission: true });
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                        className="normal-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            showPopUp('price');
                                        }}
                                    >
                                        Change all Prices
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                        className="normal-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            showPopUp('info');
                                        }}
                                    >
                                        Add Short Info
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                        className="normal-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            showPopUp('description');
                                        }}
                                    >
                                        Add Description
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                        className="normal-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            showPopUp('restrictions');
                                        }}
                                    >
                                        Add Restrictions
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                        className="normal-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            showPopUp('ingredients');
                                        }}
                                    >
                                        Add Ingredients
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                        className="normal-buttons"
                                        disabled={state.checkedDishes.length <= 0}
                                        onClick={() => {
                                            showPopUp('extras');
                                        }}
                                    >
                                        Add Extras
                                    </Button>
                                    <DishModificationPopUp
                                        popup={state.popup}
                                        hidePopup={showPopUp}
                                        popUpSubmit={popUpSubmit}
                                        category={state.popupCategory}
                                        restaurantId={globalState.restaurantIdPortal}
                                        dishIds={state.checkedDishes}
                                    />
                                </>
                            )}
                        </>
                    )}
                    {state.editMode ? listView() : galleryView()}
                </>
            ) : null}
        </div>
    );
};

Dishes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Dishes));
