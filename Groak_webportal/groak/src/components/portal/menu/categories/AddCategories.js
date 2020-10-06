/**
 * This component is adding in categories page
 */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useSnackbar } from 'notistack';

import { randomNumber } from '../../../../catalog/Others';

import { DemoCategoryEndTime, DemoCategoryStartTime } from '../../../../catalog/Demo';
import AddListCategory from './category/AddListCategory';
import { NoCategoryTitle } from '../../../../catalog/NotificationsComments';
import { addCategoriesAPI } from './CategoriesAPICalls';

const initialState = { newCategories: [] };

function reducer(state, action) {
    let newNewCategories;
    switch (action.type) {
        case 'setName':
            newNewCategories = [...state.newCategories];
            newNewCategories[action.index].categoryItem.name = action.name;
            return { ...state, newCategories: newNewCategories };
        case 'addCategory':
            return { ...state,
                newCategories: [...state.newCategories, {
                    key: randomNumber(),
                    categoryItem: {
                        name: '',
                        startTime: {
                            sunday: DemoCategoryStartTime,
                            monday: DemoCategoryStartTime,
                            tuesday: DemoCategoryStartTime,
                            wednesday: DemoCategoryStartTime,
                            thursday: DemoCategoryStartTime,
                            friday: DemoCategoryStartTime,
                            saturday: DemoCategoryStartTime,
                        },
                        endTime: {
                            sunday: DemoCategoryEndTime,
                            monday: DemoCategoryEndTime,
                            tuesday: DemoCategoryEndTime,
                            wednesday: DemoCategoryEndTime,
                            thursday: DemoCategoryEndTime,
                            friday: DemoCategoryEndTime,
                            saturday: DemoCategoryEndTime,
                        },
                        days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                        dishes: [],
                    } }] };
        case 'removeCategory':
            newNewCategories = [...state.newCategories];
            newNewCategories.pop();
            return { ...state, newCategories: newNewCategories };
        case 'removeAllCategories':
            newNewCategories = [...state.newCategories];
            newNewCategories.pop();
            return { ...state, newCategories: [] };
        case 'closeAddCategory':
            return { ...state, newCategories: [] };
        default:
            return initialState;
    }
}

const AddCategories = (props) => {
    const { restaurantId, completeAddingCategory } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    const addCategories = async () => {
        const newDatas = [];
        let unsuccessful = false;
        state.newCategories.forEach((category) => {
            if (!category.categoryItem || !category.categoryItem.name || category.categoryItem.name.length <= 0) {
                enqueueSnackbar(NoCategoryTitle, { variant: 'error' });
                unsuccessful = true;
                return;
            }
            newDatas.push({ ...category.categoryItem });
        });

        if (!unsuccessful) {
            await addCategoriesAPI(restaurantId, newDatas, enqueueSnackbar);
            setState({ type: 'removeAllCategories' });
            completeAddingCategory();
        }
    };

    return (
        <>
            {state.newCategories.map((category, index) => {
                return (
                    <AddListCategory
                        key={category.key}
                        index={index}
                        name={category.categoryItem.name}
                        setState={setState}
                    />
                );
            })}
            <TableRow key={randomNumber()}>
                <TableCell>
                    <Button
                        variant="contained"
                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '12px', margin: '5px' }}
                        className="success-buttons"
                        disabled={state.newCategories <= 0}
                        onClick={() => {
                            addCategories();
                        }}
                    >
                        Save
                    </Button>
                </TableCell>
                <TableCell align="center">
                </TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '12px', margin: '5px' }}
                        className="cancel-buttons"
                        disabled={state.newCategories.length <= 0}
                        onClick={() => {
                            setState({ type: 'removeCategory' });
                        }}
                    >
                        Remove Category
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '12px', margin: '5px' }}
                        className="success-buttons"
                        onClick={() => {
                            setState({ type: 'addCategory' });
                        }}
                    >
                        Add Category
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
};

AddCategories.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    completeAddingCategory: PropTypes.func.isRequired,
};

export default React.memo(AddCategories);
