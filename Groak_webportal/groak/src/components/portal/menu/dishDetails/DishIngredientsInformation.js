/**
 * This class is part of Dish Details that is used for displaying the ingredients of dishes
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Fab, Button } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import { InvalidDishIngredientsIndividual } from '../../../../catalog/NotificationsComments';

import { randomNumber, TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';

const DishIngredientsInformation = (props) => {
    const { classes, showTitle, checkFields, ingredients, setState } = props;

    /**
     * This function is used for adding ingredients
     */
    const addIngredientsHandler = () => {
        const updatedIngredients = [...ingredients, { id: randomNumber(), title: '' }];
        setState({ type: 'setIngredients', ingredients: updatedIngredients });
    };

    /**
     * This function is used to remove ingredients
     *
     * @param {*} index this is the index of the ingredient that needs to be removed
     */
    const removeIngredientsHandler = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setState({ type: 'setIngredients', ingredients: updatedIngredients });
    };

    /**
     * This function is used for changing ingredients name
     * @param {*} event this contains the new ingredient
     * @param {*} index this contains the index of ingredient that is being altered
     */
    const ingredientTitleAltered = (event, index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index].title = event.target.value;
        setState({ type: 'setIngredients', ingredients: updatedIngredients });
    };

    return (
        <div className="dish-ingredients-information">
            {showTitle ? <h2>Ingredients:</h2> : null}
            {ingredients.map((ingredient, index) => {
                return (
                    <div className="ingredient-element" key={ingredient.id}>
                        <Fab
                            className="delete"
                            size="small"
                            aria-label="add"
                            onClick={() => { removeIngredientsHandler(index); }}
                        >
                            <CloseRounded />
                        </Fab>
                        <TextField
                            label="Ingredient:"
                            type="text"
                            value={ingredient.title}
                            placeholder="Ex: Tomatoes"
                            margin="normal"
                            variant="outlined"
                            helperText={ingredient.title.length <= 0 && checkFields ? InvalidDishIngredientsIndividual : null}
                            error={checkFields && ingredient.title.length <= 0}
                            InputLabelProps={textFieldLabelProps(classes)}
                            onChange={(event) => { ingredientTitleAltered(event, index); }}
                        />
                    </div>
                );
            })}
            <Button
                className="normal-buttons"
                onClick={addIngredientsHandler}
            >
                Add Ingredient
            </Button>
        </div>
    );
};

DishIngredientsInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    showTitle: PropTypes.bool.isRequired,
    checkFields: PropTypes.bool.isRequired,
    ingredients: PropTypes.array.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(DishIngredientsInformation));
