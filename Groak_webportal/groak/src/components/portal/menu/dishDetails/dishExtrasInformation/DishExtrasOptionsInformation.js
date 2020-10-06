/**
 * This class is part of Dish Details that is used for displaying the extras for a dish.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { InputAdornment, TextField, Fab } from '@material-ui/core';
import { Add, CloseRounded, AttachMoney } from '@material-ui/icons';
import { randomNumber, TextFieldLabelStyles, textFieldLabelProps } from '../../../../../catalog/Others';
import { InvalidDishExtrasTitle, InvalidDishExtrasPrice } from '../../../../../catalog/NotificationsComments';

const DishExtrasOptionsInformation = (props) => {
    const { classes, checkFields, extras, setState, extra, index } = props;

    /**
     * This function is called when an option in extra has to be added
     */
    const addOptionsHandler = () => {
        const updatedExtras = [...extras];
        updatedExtras[index].options.push({
            id: randomNumber(),
            title: '',
            price: '',
        });
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    /**
     * This function is called when an option in extra has to be removed
     *
     * @param {*} indexOptions this is the index of options which has to be removed
     */
    const removeOptionsHandler = (indexOptions) => {
        const updatedExtras = [...extras];
        updatedExtras[index].options.splice(indexOptions, 1);
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    /**
     * This function is called when the title of an option has to be altered
     *
     * @param {*} event this contains the data that is eneterd in the textfield
     * @param {*} indexOptions this is the index of options which has to be removed
     */
    const optionsTitleAltered = (event, indexOptions) => {
        const updatedExtras = [...extras];
        updatedExtras[index].options[indexOptions].title = event.target.value;
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    /**
     * This function is called when the price of an option has to be altered
     *
     * @param {*} event this contains the data that is eneterd in the textfield
     * @param {*} indexOptions this is the index of options which has to be removed
     */
    const optionsPriceAltered = (event, indexOptions) => {
        const updatedExtras = [...extras];
        updatedExtras[index].options[indexOptions].price = event.target.value;
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    return (
        <div className="dish-extras-options-information">
            <p>Options</p>
            {extra.options.map((option, indexOptions) => {
                return (
                    <div className="option-element" key={option.id}>
                        <Fab
                            className="delete"
                            size="small"
                            aria-label="add"
                            onClick={() => { removeOptionsHandler(indexOptions); }}
                        >
                            <CloseRounded />
                        </Fab>
                        <TextField
                            label="Option Title:"
                            type="text"
                            value={option.title}
                            placeholder="Ex: Hot/Medium/Mild"
                            margin="normal"
                            variant="outlined"
                            helperText={option.title.length <= 0 && checkFields ? InvalidDishExtrasTitle : null}
                            error={checkFields && option.title.length <= 0}
                            onChange={(event) => { optionsTitleAltered(event, indexOptions); }}
                            InputLabelProps={textFieldLabelProps(classes)}
                        />
                        <TextField
                            label="Option Price:"
                            type="number"
                            value={option.price}
                            margin="normal"
                            placeholder="Ex: 0.5"
                            helperText={option.price < 0 ? InvalidDishExtrasPrice : null}
                            variant="outlined"
                            error={option.price < 0}
                            onChange={(event) => { optionsPriceAltered(event, indexOptions); }}
                            InputLabelProps={textFieldLabelProps(classes)}
                            InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment> }}
                        />
                    </div>
                );
            })}
            <Fab
                className="add"
                size="small"
                onClick={addOptionsHandler}
            >
                <Add />
            </Fab>
        </div>
    );
};

DishExtrasOptionsInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    checkFields: PropTypes.bool.isRequired,
    extras: PropTypes.array.isRequired,
    setState: PropTypes.func.isRequired,
    extra: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(withStyles(TextFieldLabelStyles)(DishExtrasOptionsInformation));
