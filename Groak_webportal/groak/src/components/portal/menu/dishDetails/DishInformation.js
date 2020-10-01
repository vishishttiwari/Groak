/**
 * This class is part of Dish Details that is used for displaying the dish information such as name, price, shortInfo and description
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { InputAdornment, TextField } from '@material-ui/core';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
import { DemoDishName, DemoDishPrice, DemoDishShortInfo, DemoDishDescription } from '../../../../catalog/Demo';
import { DishShortInfo, DishDescription } from '../../../../catalog/Comments';
import { NoDishTitle, InvalidDishPrice } from '../../../../catalog/NotificationsComments';

const DishInformation = (props) => {
    const { classes, checkFields, name, price, shortInfo, description, setState } = props;

    const mainInputFields = [
        {
            key: 'name',
            multiline: true,
            title: 'Dish Name',
            type: 'text',
            value: name,
            placeholder: `Ex: ${DemoDishName}`,
            showHelper: (name.length <= 0),
            helperText: NoDishTitle,
            error: (name.length <= 0),
            required: true,
            shrink: name.length > 0,
            onChange: (event) => { setState({ type: 'setName', name: event.target.value }); },
        },
        {
            key: 'price',
            multiline: true,
            title: 'Price',
            type: 'number',
            value: price,
            placeholder: `Ex: ${DemoDishPrice}`,
            showHelper: (parseFloat(price) < 0 || price.length === 0),
            helperText: InvalidDishPrice,
            required: true,
            money: true,
            error: (parseFloat(price) < 0 || price.length === 0),
            shrink: price.length > 0,
            onChange: (event) => { setState({ type: 'setPrice', price: event.target.value }); },
        },
        {
            key: 'info',
            multiline: false,
            rows: '4',
            title: 'Short Info',
            type: 'text',
            value: shortInfo,
            placeholder: `Ex: ${DemoDishShortInfo}`,
            showHelper: true,
            helperText: DishShortInfo,
            required: false,
            shrink: shortInfo.length > 0,
            onChange: (event) => { setState({ type: 'setShortInfo', shortInfo: event.target.value }); },
        },
        {
            key: 'description',
            multiline: false,
            rows: '5',
            title: 'Description',
            type: 'text',
            value: description,
            placeholder: `Ex: ${DemoDishDescription}`,
            showHelper: true,
            helperText: DishDescription,
            required: false,
            shrink: description.length > 0,
            onChange: (event) => { setState({ type: 'setDescription', description: event.target.value }); },
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
            helperText: inputField.showHelper && checkFields ? inputField.helperText : null,
            margin: 'normal',
            fullWidth: true,
            required: inputField.required,
            error: inputField.error && checkFields,
            shrink: inputField.shrink.toString(),
            variant: 'outlined',
            InputLabelProps: textFieldLabelProps(classes),
            InputProps: inputField.money ? ({ endAdornment: (<InputAdornment position="end"><AttachMoney /></InputAdornment>) }) : null,
        };
    };

    return (
        <div className="dish-information">
            <h2>Dish Information:</h2>
            {mainInputFields.map((inputField) => {
                return (
                    <React.Fragment key={inputField.key}>
                        {inputField.multiline ? (
                            <TextField
                                {...fieldProps(inputField)}
                            />
                        ) : (
                            <TextField
                                {...fieldProps(inputField)}
                                multiline
                                rows={inputField.rows}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

DishInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    checkFields: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    shortInfo: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(DishInformation));
