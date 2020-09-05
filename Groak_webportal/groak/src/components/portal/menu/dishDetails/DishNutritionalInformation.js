/**
 * This class is part of Dish Details that is used for displaying the nutritional info of dishes
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { InputAdornment, TextField } from '@material-ui/core';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
import { DemoDishCalories, DemoDishCarbs, DemoDishFats, DemoDishProtein } from '../../../../catalog/Demo';
import { InvalidDishNutritionalInfo } from '../../../../catalog/NotificationsComments';

const DishNutritionalInformation = (props) => {
    const { classes, calories, fats, protein, carbs, setState } = props;

    const nutritionalInputFields = [
        {
            key: 'calories',
            title: 'Calories(per 100g)',
            type: 'number',
            value: calories,
            placeholder: `Ex: ${DemoDishCalories}`,
            required: false,
            error: (parseFloat(calories) < 0),
            unit: 'kCal',
            onChange: (event) => { setState({ type: 'setCalories', calories: event.target.value }); },
        },
        {
            key: 'fats',
            title: 'Fats(per 100g)',
            type: 'number',
            value: fats,
            placeholder: `Ex: ${DemoDishFats}`,
            required: false,
            error: (parseFloat(fats) < 0),
            unit: 'grams',
            onChange: (event) => { setState({ type: 'setFats', fats: event.target.value }); },
        },
        {
            key: 'protein',
            title: 'Protein(per 100g)',
            type: 'number',
            value: protein,
            placeholder: `Ex: ${DemoDishProtein}`,
            required: false,
            error: (parseFloat(protein) < 0),
            unit: 'grams',
            onChange: (event) => { setState({ type: 'setProtein', protein: event.target.value }); },
        },
        {
            key: 'carbs',
            title: 'Carbs(per 100g)',
            type: 'number',
            value: carbs,
            placeholder: `Ex: ${DemoDishCarbs}`,
            required: false,
            error: (parseFloat(carbs) < 0),
            unit: 'grams',
            onChange: (event) => { setState({ type: 'setCarbs', carbs: event.target.value }); },
        },
    ];

    /**
     * This function creates TextField props when given info about what needs to be presented
     *
     * @param {*} inputField
     */
    const fieldProps = (inputField) => {
        return {
            label: `${inputField.title}:`,
            type: inputField.type,
            placeholder: inputField.placeholder,
            value: inputField.value,
            onChange: inputField.onChange,
            margin: 'normal',
            fullWidth: true,
            variant: 'outlined',
            required: inputField.required,
            helperText: (parseFloat(inputField.value) < 0) ? InvalidDishNutritionalInfo : null,
            error: inputField.error,
            InputLabelProps: textFieldLabelProps(classes),
            InputProps: { endAdornment: (<InputAdornment position="end">{inputField.unit}</InputAdornment>) },
        };
    };

    return (
        <div className="dish-nutritional-information">
            <h2>Nutritional Info:</h2>
            {nutritionalInputFields.map((inputField) => {
                return (
                    <React.Fragment key={inputField.key}>
                        <TextField
                            {...fieldProps(inputField)}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
};

DishNutritionalInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    calories: PropTypes.string.isRequired,
    fats: PropTypes.string.isRequired,
    protein: PropTypes.string.isRequired,
    carbs: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(DishNutritionalInformation));
