/**
 * Used for confirming with user if they are ok with asking for waiter
 */
import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { IconButton, Button, TextField, Dialog, DialogActions, InputAdornment } from '@material-ui/core';
import { AttachMoney, CloseRounded } from '@material-ui/icons';
import { updateDishesFromArrayAPI } from './DishesAPICalls';
import DishRestrictionInformation from '../dishDetails/DishRestrictionInformation';
import DishIngredientsInformation from '../dishDetails/DishIngredientsInformation';
import DishExtrasInformation from '../dishDetails/dishExtrasInformation/DishExtrasInformation';

const initialState = {
    text: '',
    vegetarian: 'Not Sure',
    vegan: 'Not Sure',
    glutenFree: 'Not Sure',
    kosher: 'Not Sure',
    seaFood: 'Not Sure',
    extras: [],
    ingredients: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'setText':
            return { ...state, text: action.text };
        case 'setVegetarian':
            return { ...state, vegetarian: action.vegetarian };
        case 'setVegan':
            return { ...state, vegan: action.vegan };
        case 'setGlutenFree':
            return { ...state, glutenFree: action.glutenFree };
        case 'setKosher':
            return { ...state, kosher: action.kosher };
        case 'setSeaFood':
            return { ...state, seaFood: action.seaFood };
        case 'setExtras':
            return { ...state, extras: action.extras };
        case 'setIngredients':
            return { ...state, ingredients: action.ingredients };
        default:
            return { ...state };
    }
}

const DishModificationPopUp = (props) => {
    const { popup, hidePopup, popUpSubmit, restaurantId, dishIds, category } = props;
    const [state, setStateLocal] = useReducer(reducer, initialState);
    const [scroll, setScroll] = React.useState('paper');
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setScroll('paper');
    }, []);

    const header = () => {
        if (category === 'info') {
            return 'Short Info';
        } if (category === 'price') {
            return 'Price';
        } if (category === 'description') {
            return 'Description';
        } if (category === 'restrictions') {
            return 'Restrictions';
        } if (category === 'ingredients') {
            return 'Ingredients';
        } if (category === 'extras') {
            return 'Extras';
        }
        return '';
    };

    const finalActions = () => {
        if (category === 'info' || category === 'description') {
            return (
                <TextField
                    className="pop-up-after-restaurant-actions-message"
                    label={header()}
                    type="text"
                    autoFocus
                    // helperText={helperText()}
                    placeholder="Great food, nice ambience :)"
                    fullWidth
                    multiline
                    rows="4"
                    variant="filled"
                    value={state.message}
                    onChange={(event) => {
                        setStateLocal({ type: 'setText', text: event.target.value });
                    }}
                />
            );
        } if (category === 'price') {
            return (
                <TextField
                    className="pop-up-after-restaurant-actions-message"
                    label={header()}
                    type="number"
                    autoFocus
                    // helperText={helperText()}
                    placeholder="5"
                    fullWidth
                    multiline
                    variant="outlined"
                    value={state.message}
                    onChange={(event) => {
                        setStateLocal({ type: 'setText', text: event.target.value });
                    }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment> }}
                />
            );
        } if (category === 'restrictions') {
            return (<DishRestrictionInformation showTitle={false} vegetarian={state.vegetarian} vegan={state.vegan} glutenFree={state.glutenFree} kosher={state.kosher} seaFood={state.seaFood} setState={setStateLocal} />);
        } if (category === 'ingredients') {
            return (<DishIngredientsInformation showTitle={false} checkFields={false} ingredients={state.ingredients} setState={setStateLocal} />);
        } if (category === 'extras') {
            return (<DishExtrasInformation showTitle={false} checkFields={false} extras={state.extras} setState={setStateLocal} />);
        }
        return (null);
    };

    const submit = async () => {
        if (category === 'info' || category === 'description') {
            await updateDishesFromArrayAPI(restaurantId, dishIds, category, state.text, enqueueSnackbar);
        } else if (category === 'price') {
            await updateDishesFromArrayAPI(restaurantId, dishIds, category, parseFloat(state.text), enqueueSnackbar);
        } else if (category === 'restrictions') {
            await updateDishesFromArrayAPI(restaurantId, dishIds, category, {
                vegetarian: state.vegetarian,
                vegan: state.vegan,
                glutenFree: state.glutenFree,
                kosher: state.kosher,
                seaFood: state.seaFood,
            }, enqueueSnackbar);
        } else if (category === 'ingredients') {
            await updateDishesFromArrayAPI(restaurantId, dishIds, category, state.ingredients.map((ingredient) => {
                return ingredient.title;
            }), enqueueSnackbar);
        } else if (category === 'extras') {
            await updateDishesFromArrayAPI(restaurantId, dishIds, category, state.extras.map((extra) => {
                const updatedExtra = { ...extra };
                delete updatedExtra.id;
                updatedExtra.minOptionsSelect = extra.minOptionsSelect ? parseFloat(extra.minOptionsSelect) : 0;
                updatedExtra.maxOptionsSelect = extra.maxOptionsSelect ? parseFloat(extra.maxOptionsSelect) : updatedExtra.options.length;
                updatedExtra.options = extra.options.map((option) => {
                    const updatedOption = { ...option };
                    delete updatedOption.id;
                    updatedOption.price = option.price ? parseFloat(option.price) : 0;
                    return updatedOption;
                });
                return updatedExtra;
            }), enqueueSnackbar);
        }
        await popUpSubmit();
    };

    return (
        <Dialog
            className="pop-up-after-restaurant"
            open={popup}
            onClose={(() => {
                hidePopup('');
            })}
            scroll={scroll}
        >
            <div className="pop-up-after-restaurant-title">
                <p>{header()}</p>
                <IconButton onClick={(
                    () => {
                        hidePopup('');
                    })}
                >
                    <CloseRounded className="pop-up-after-restaurant-title-close" />
                </IconButton>
            </div>
            <DialogActions className="pop-up-after-restaurant-actions">
                {finalActions()}
                <Button
                    className="pop-up-after-restaurant-actions-button"
                    type="button"
                    onClick={async () => {
                        await submit();
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

DishModificationPopUp.propTypes = {
    popup: PropTypes.bool.isRequired,
    hidePopup: PropTypes.func.isRequired,
    popUpSubmit: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
    restaurantId: PropTypes.string.isRequired,
    dishIds: PropTypes.array.isRequired,
};

export default React.memo(DishModificationPopUp);
