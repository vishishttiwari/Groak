/**
 * This components is used to represent the selected dishes in qrcodes details
 */
import React, { useEffect, useReducer, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import SearchBar from 'material-ui-search-bar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import { context } from '../../../../../globalState/globalState';

import { CategoryDishesOrder } from '../../../../../catalog/Comments';
import SortableList from '../../../../dnd/SortableList';
import SortableItem from '../../../../dnd/SortableItem';
import EditingListDish from './EditingListDish';
import DishModificationPopUp from '../../dishes/DishModificationPopUp';
import { deleteSelectedDishesAPI } from '../../dishes/DishesAPICalls';
import Decision from '../../../../ui/decision/Decision';
import { DeleteDishesPopUp, DeleteDishesPopUpTitle } from '../../../../../catalog/NotificationsComments';

const initialState = {
    deletePermission: false,
    searchField: '',
    popup: false,
    popupCategory: '',
    checkedDishes: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'setDeletePermission':
            return { ...state, deletePermission: action.deletePermission };
        case 'setCheckedDishes':
            return { ...state, checkedDishes: action.checkedDishes };
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        case 'setPopup':
            return { ...state, popup: action.popup, popupCategory: action.popupCategory };
        default:
            return initialState;
    }
}

const CategorySelectedDishes = (props) => {
    const { history, selectedDishesPath, allDishesMap, checkDishHandler, changeDishPositionHandler, refresh } = props;
    const { globalState } = useContext(context);
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const checkedDishes = [];
        selectedDishesPath.forEach((dish) => {
            const bits = dish.split('/');
            const lastOne = bits[bits.length - 1];
            checkedDishes.push(lastOne);
        });
        setState({ type: 'setCheckedDishes', checkedDishes });
    }, [selectedDishesPath]);

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            changeDishPositionHandler(arrayMove(selectedDishesPath, oldIndex, newIndex));
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
     * This function is called when dish is pressed
     *
     * @param {*} id
     */
    function dishDetailHandler(id) {
        history.push(`/dishes/${id}`);
    }

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
            // await refresh();
        }
        setState({ type: 'setPopup', popup: false, popupCategory: '' });
    };

    /**
     * This function is called when delete button is called for selected dishes
     */
    const deleteSelectedDishes = async () => {
        await deleteSelectedDishesAPI(globalState.restaurantIdPortal, state.checkedDishes, enqueueSnackbar);
        await refresh();
    };

    /**
     * This function is called when the delete button is pressed
     *
     * @param {*} granted this tells if the user has granted permission to delete in the popup
     */
    const userPermissionResponse = async (granted) => {
        if (granted) {
            await deleteSelectedDishes();
        }
        setState({ type: 'setDeletePermission', deletePermission: false });
    };

    return (
        <div className="category-dishes">
            <Decision open={state.deletePermission} response={userPermissionResponse} title={DeleteDishesPopUpTitle} content={DeleteDishesPopUp} />
            <h2>Selected Dishes:</h2>
            {selectedDishesPath && selectedDishesPath.length !== 0 ? <p>{CategoryDishesOrder}</p> : null}
            <SearchBar
                className="search-bar"
                value={state.searchField}
                onChange={(newValue) => {
                    setState({ type: 'setSearchField', searchField: newValue });
                }}
            />
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
            <p>To see any instant changes in price and info, you would need to refresh the page</p>
            <DishModificationPopUp
                popup={state.popup}
                hidePopup={showPopUp}
                popUpSubmit={popUpSubmit}
                category={state.popupCategory}
                restaurantId={globalState.restaurantIdPortal}
                dishIds={state.checkedDishes}
            />
            <div className="dishes-list-view">
                <Paper>
                    <TableContainer>
                        <Table size="small" aria-label="dishes table">
                            <TableHead style={{ overflowX: 'scroll' }}>
                                <TableRow>
                                    <TableCell width="200px" className="dish-items-list-view-heading">Name</TableCell>
                                    <TableCell width="200px" className="dish-items-list-view-heading" align="center">Price</TableCell>
                                    <TableCell width="150px" className="dish-items-list-view-heading" align="center">Photo</TableCell>
                                    <TableCell width="500px" className="dish-items-list-view-heading" align="center">Description</TableCell>
                                    <TableCell width="120px" className="dish-items-list-view-heading" align="center">Actions</TableCell>
                                    <TableCell width="50px" className="dish-items-list-view-heading" align="center">Select</TableCell>
                                </TableRow>
                            </TableHead>

                            <SortableList axis="y" lockAxis="y" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                                <TableBody>
                                    {selectedDishesPath.map((dishPath, index) => {
                                        const dish = allDishesMap.get(dishPath);
                                        return (isDishVisible(dish)
                                            ? (
                                                <SortableItem key={dish.id} index={index}>
                                                    <EditingListDish
                                                        key={dish.id}
                                                        restaurantId={globalState.restaurantIdPortal}
                                                        dishItem={dish}
                                                        dishDetailHandler={() => { return dishDetailHandler(dish.id); }}
                                                        checked
                                                        addToCheckedDish={checkDishHandler}
                                                    />
                                                </SortableItem>
                                            ) : null
                                        );
                                    })}
                                </TableBody>
                            </SortableList>

                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
};

CategorySelectedDishes.propTypes = {
    history: PropTypes.object.isRequired,
    selectedDishesPath: PropTypes.array.isRequired,
    allDishesMap: PropTypes.instanceOf(Map).isRequired,
    checkDishHandler: PropTypes.func.isRequired,
    changeDishPositionHandler: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
};

export default withRouter(React.memo(CategorySelectedDishes));
