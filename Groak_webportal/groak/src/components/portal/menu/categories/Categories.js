/**
 * This component is used for the categories page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import SearchBar from 'material-ui-search-bar';
import Switch from '@material-ui/core/Switch';
import { Button, Checkbox } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { context } from '../../../../globalState/globalState';

import './css/Categories.css';
import { fetchCategoriesAPI, changeAvailabilityOfCategoryAPI, changeCategoryOrderAPI, deleteSelectedCategoriesAPI } from './CategoriesAPICalls';
import Category from './category/Category';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoCategories, CategoryOrder, CategoriesNotFound } from '../../../../catalog/Comments';
import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';
import Empty from '../../../../assets/others/empty.png';
import ListCategory from './category/ListCategory';
import CategoryModificationPopUp from './CategoryModificationPopUp';
import AddCategories from './AddCategories';

const initialState = { categories: [], searchField: '', popup: false, popupCategory: '', checkAll: false, checkedCategories: [], editMode: false, changeOrder: false, loadingSpinner: true };

function reducer(state, action) {
    let newCheckedCategories;
    let index;
    switch (action.type) {
        case 'fetchCategories':
            return { ...state, categories: action.categories, loadingSpinner: false };
        case 'setCategories':
            return { ...state, categories: action.categories, loadingSpinner: false };
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        case 'setEditMode':
            return { ...state, editMode: action.editMode, changeOrder: false };
        case 'setChangeOrder':
            return { ...state, changeOrder: action.changeOrder };
        case 'appendCheckedCategories':
            return { ...state, checkedCategories: [...state.checkedCategories, action.categoryId] };
        case 'setPopup':
            return { ...state, popup: action.popup, popupCategory: action.popupCategory };
        case 'removeCheckedCategories':
            newCheckedCategories = [...state.checkedCategories];
            index = newCheckedCategories.indexOf(action.categoryId);
            if (index > -1) {
                newCheckedCategories.splice(index, 1);
            }
            return { ...state, checkedCategories: newCheckedCategories };
        case 'setCheckedCategories':
            return { ...state, checkedCategories: action.checkedCategories };
        case 'setCheckAll':
            return { ...state, checkAll: action.checkAll };
        default:
            return state;
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

const Categories = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    useEffect(() => {
        async function fetchCategories() {
            await fetchCategoriesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
        }
        fetchCategories();
    }, [globalState.restaurantIdPortal, enqueueSnackbar]);

    /**
     * This function is passed into the category component which is called everytime
     * the available button is pressed
     *
     * @param {*} changedCategory this is the category for which availability is changed
     */
    async function availableCategoryHandler(changedCategory) {
        await changeAvailabilityOfCategoryAPI(globalState.restaurantIdPortal, state.categories, setState, changedCategory, enqueueSnackbar);
    }

    /**
     * This function is called to add a category. This function is passed to the heading
     */
    function addCategoryHandler() {
        history.push('/categories/addCategory');
    }

    /**
     * This function is called when each category is pressed.
     *
     * @param {*} id this is the id of the category that is passed
     */
    function categoryDetailHandler(id) {
        history.push(`/categories/${id}`);
    }

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedCategories = arrayMove(state.categories, oldIndex, newIndex);
            setState({ type: 'setCategories',
                categories: updatedCategories,
            });
            await changeCategoryOrderAPI(globalState.restaurantIdPortal, updatedCategories.map((category) => {
                return category.reference;
            }), enqueueSnackbar);
        }
    };

    /**
     * This function decides if category is visble after writing something up in the search bar
     *
     * @param {*} category
     */
    const isCategoryVisible = (category) => {
        if (!category) { return false; }
        if (state.searchField.length <= 0) { return true; }
        if (category.name && category.name.toLowerCase().startsWith(state.searchField.toLowerCase())) { return true; }
        if (category.name) {
            const categoryName = category.name.split(' ');
            for (let i = 0; i < categoryName.length; i += 1) {
                if (categoryName[i] && categoryName[i].toLowerCase().startsWith(state.searchField.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
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
     * This function is called when order toggle is pressed
     *
     * @param {*} checked
     */
    const orderToggle = (checked) => {
        setState({ type: 'setChangeOrder', changeOrder: checked });
    };

    /**
     * This function is called when the save button is clicked after adding
     */
    const completeAddingCategory = async () => {
        setState({ type: 'closeAddDish' });
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        await fetchCategoriesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
    };

    /**
     * When check is pressed on any category, this function is called
     *
     * @param {*} id
     */
    const addToCheckedCategory = (id) => {
        if (!state.checkedCategories.includes(id)) {
            setState({ type: 'appendCheckedCategories', categoryId: id });
        } else {
            setState({ type: 'removeCheckedCategories', categoryId: id });
            setState({ type: 'setCheckAll', checkAll: false });
        }
    };

    /**
     * Called when all check on Categories are pressed
     */
    const addAllToCheckedCategory = () => {
        if (!state.checkAll) {
            const checkedCategories = [];
            state.categories.forEach((category) => {
                if (!checkedCategories.includes(category.id)) {
                    checkedCategories.push(category.id);
                }
            });
            setState({ type: 'setCheckedCategories', checkedCategories });
            setState({ type: 'setCheckAll', checkAll: true });
        } else {
            setState({ type: 'setCheckedCategories', checkedCategories: [] });
            setState({ type: 'setCheckAll', checkAll: false });
        }
    };

    /**
     * This function is called when delete button is called for selected categories
     */
    const deleteSelectedCategories = async () => {
        setState({ type: 'setCheckedCategories', checkedCategories: [] });
        await deleteSelectedCategoriesAPI(globalState.restaurantIdPortal, state.checkedCategories, enqueueSnackbar);
        await fetchCategoriesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
        setState({ type: 'setEditMode', editMode: true });
        setState({ type: 'setCheckAll', checkAll: false });
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
        if (state.popupCategory === 'days') {
            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
            await fetchCategoriesAPI(globalState.restaurantIdPortal, setState, enqueueSnackbar);
        }
        setState({ type: 'setPopup', popup: false, popupCategory: '' });
    };

    const galleryView = () => {
        return (
            <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                <div className="category-items">
                    {state.categories.map((category, index) => {
                        return (isCategoryVisible(category)
                            ? (
                                <SortableItem key={category.id} index={index} disabled={!state.changeOrder}>
                                    <Category
                                        categoryItem={category}
                                        availableCategoryHandler={availableCategoryHandler}
                                        clickHandler={() => { categoryDetailHandler(category.id); }}
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
            <div className="category-items-list-view">
                <Paper className={classes.root}>
                    <TableContainer>
                        <Table className={classes.table} aria-label="categories table">
                            <TableHead style={{ overflowX: 'scroll' }}>
                                <TableRow>
                                    <TableCell width="200px" className="category-items-list-view-heading">Name</TableCell>
                                    <TableCell width="500px" className="category-items-list-view-heading" align="center">Dishes</TableCell>
                                    <TableCell width="100px" className="category-items-list-view-heading" align="center">Actions</TableCell>
                                    <TableCell width="50px" className="category-items-list-view-heading" align="center">
                                        <Checkbox
                                            className="check-box"
                                            icon={<CheckBoxOutlineBlank fontSize="large" />}
                                            checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                                            checked={state.checkAll}
                                            onChange={() => { addAllToCheckedCategory(); }}
                                            onClick={(event) => { event.stopPropagation(); }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AddCategories
                                    restaurantId={globalState.restaurantIdPortal}
                                    completeAddingCategory={completeAddingCategory}
                                />
                                {state.categories.map((category) => {
                                    return (isCategoryVisible(category)
                                        ? (
                                            <ListCategory
                                                key={category.id}
                                                restaurantId={globalState.restaurantIdPortal}
                                                categoryItem={category}
                                                clickHandler={() => { categoryDetailHandler(category.id); }}
                                                checked={state.checkedCategories.includes(category.id)}
                                                addToCheckedCategory={addToCheckedCategory}
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

    return (
        <div className="categories">
            <Heading heading="Menu Categories" buttonName="Add Category" onClick={addCategoryHandler} />
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
                    {
                        state.categories && state.categories.length === 0 ? (
                            <>
                                <p className="text-on-background">{NoCategories}</p>
                                <div className="not-found">
                                    <p className="not-found-text">{CategoriesNotFound}</p>
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
                                    <p className="toggle-label">Edit Categories</p>
                                </div>
                                {!state.editMode ? (
                                    <>
                                        <p className="text-on-background">{CategoryOrder}</p>
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
                                            disabled={state.checkedCategories.length <= 0}
                                            onClick={() => {
                                                deleteSelectedCategories();
                                            }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ minWidth: '100px', maxWidth: '200px', fontSize: '10px', margin: '5px' }}
                                            className="normal-buttons"
                                            disabled={state.checkedCategories.length <= 0}
                                            onClick={() => {
                                                showPopUp('days');
                                            }}
                                        >
                                            Set Active Days
                                        </Button>
                                        <CategoryModificationPopUp
                                            popup={state.popup}
                                            hidePopup={showPopUp}
                                            popUpSubmit={popUpSubmit}
                                            category={state.popupCategory}
                                            restaurantId={globalState.restaurantIdPortal}
                                            categoryIds={state.checkedCategories}
                                        />
                                    </>
                                )}
                            </>
                        )
                    }
                    {state.editMode ? listView() : galleryView()}
                </>
            ) : null}
        </div>
    );
};

Categories.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Categories));
