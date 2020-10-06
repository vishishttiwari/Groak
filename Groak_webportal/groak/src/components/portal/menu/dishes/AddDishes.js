/**
 * This component is adding in dishes page
 */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useSnackbar } from 'notistack';

import { randomNumber } from '../../../../catalog/Others';

import './css/Dishes.css';
import { InvalidDishPrice, NoDishTitle } from '../../../../catalog/NotificationsComments';
import AddListDish from './dish/AddListDish';
import { addDishesAPI } from './DishesAPICalls';

const initialState = { newDishes: [] };

function reducer(state, action) {
    let newNewDishes;
    switch (action.type) {
        case 'setName':
            newNewDishes = [...state.newDishes];
            newNewDishes[action.index].dishItem.name = action.name;
            return { ...state, newDishes: newNewDishes };
        case 'setPrice':
            newNewDishes = [...state.newDishes];
            newNewDishes[action.index].dishItem.price = parseFloat(action.price);
            return { ...state, newDishes: newNewDishes };
        case 'setShortInfo':
            newNewDishes = [...state.newDishes];
            newNewDishes[action.index].dishItem.shortInfo = action.shortInfo;
            return { ...state, newDishes: newNewDishes };
        case 'setImage':
            newNewDishes = [...state.newDishes];
            newNewDishes.forEach((dish, index) => {
                if (dish.key === action.id) {
                    newNewDishes[index].image = action.image;
                }
            });
            return { ...state, newDishes: newNewDishes };
        case 'addDish':
            return { ...state,
                newDishes: [...state.newDishes, {
                    key: randomNumber(),
                    image: { file: null, link: '' },
                    dishItem: { name: '',
                        price: 0,
                        shortInfo: '',
                        description: '',
                        nutrition: {
                            calories: 0,
                            fats: 0,
                            protein: 0,
                            carbs: 0,
                        },
                        restrictions: {
                            vegetarian: 'Not Sure',
                            vegan: 'Not Sure',
                            glutenFree: 'Not Sure',
                            kosher: 'Not Sure',
                            seaFood: 'Not Sure',
                        },
                        ingredients: [],
                        extras: [] } }] };
        case 'removeDish':
            newNewDishes = [...state.newDishes];
            newNewDishes.pop();
            return { ...state, newDishes: newNewDishes };
        case 'closeAddDish':
            return { ...state, newDishes: [] };
        default:
            return initialState;
    }
}

const AddDishes = (props) => {
    const { restaurantId, completeAddingDish } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    const addDishes = async () => {
        const newDatas = [];
        let unsuccessful = false;
        state.newDishes.forEach((dish) => {
            if (!dish.dishItem || !dish.dishItem.name || dish.dishItem.name.length <= 0) {
                enqueueSnackbar(NoDishTitle, { variant: 'error' });
                unsuccessful = true;
                return;
            }
            if (!dish.dishItem || dish.dishItem.price === null || dish.dishItem.price < 0) {
                enqueueSnackbar(InvalidDishPrice, { variant: 'error' });
                unsuccessful = true;
                return;
            }
            newDatas.push({ ...dish.dishItem, image: dish.image });
        });

        if (!unsuccessful) {
            await addDishesAPI(restaurantId, newDatas, enqueueSnackbar);
            completeAddingDish();
        }
    };

    return (
        <>
            {state.newDishes.map((dish, index) => {
                return (
                    <AddListDish
                        key={dish.key}
                        id={dish.key}
                        index={index}
                        name={dish.dishItem.name}
                        price={dish.dishItem.price}
                        shortInfo={dish.dishItem.shortInfo}
                        image={dish.image}
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
                        disabled={state.newDishes <= 0}
                        onClick={() => {
                            addDishes();
                        }}
                    >
                        Save
                    </Button>
                </TableCell>
                <TableCell align="center">
                </TableCell>
                <TableCell align="center">
                </TableCell>
                <TableCell align="center">
                </TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '12px', margin: '5px' }}
                        className="cancel-buttons"
                        disabled={state.newDishes.length <= 0}
                        onClick={() => {
                            setState({ type: 'removeDish' });
                        }}
                    >
                        Remove Dish
                    </Button>
                </TableCell>
                <TableCell align="center">
                    <Button
                        variant="contained"
                        style={{ minWidth: '100px', maxWidth: '200px', fontSize: '12px', margin: '5px' }}
                        className="success-buttons"
                        onClick={() => {
                            setState({ type: 'addDish' });
                        }}
                    >
                        Add Dish
                    </Button>
                </TableCell>
            </TableRow>
        </>
    );
};

AddDishes.propTypes = {
    restaurantId: PropTypes.string.isRequired,
    completeAddingDish: PropTypes.func.isRequired,
};

export default React.memo(AddDishes);
