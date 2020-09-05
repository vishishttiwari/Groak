/**
 * This class is part of Dish Details that is used for displaying the extras for a dish.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import { randomNumber } from '../../../../../catalog/Others';
import DishExtrasMultipleSelectionInformation from './DishExtrasMultipleSelectionInformation';
import DishExtrasMainInformation from './DishExtrasMainInformation';
import DishExtrasOptionsInformation from './DishExtrasOptionsInformation';

const DishExtrasInformation = (props) => {
    const { extras, checkFields, setState } = props;

    /**
     * This function is used for adding extras
     */
    const addDishExtrasHandler = () => {
        const updatedExtras = [...extras, {
            id: randomNumber(),
            title: '',
            multipleSelections: false,
            minOptionsSelect: '',
            maxOptionsSelect: '',
            options: [],
        }];
        setState({ type: 'setExtras', extras: updatedExtras });
    };

    return (
        <div className="dish-extras-information">
            <h2>Extras:</h2>
            {extras.map((extra, index) => {
                return (
                    <div className="extra-element" key={extra.id}>
                        <DishExtrasMainInformation checkFields={checkFields} extras={extras} setState={setState} extra={extra} index={index} />
                        <DishExtrasMultipleSelectionInformation extras={extras} setState={setState} extra={extra} index={index} />
                        <DishExtrasOptionsInformation checkFields={checkFields} extras={extras} setState={setState} extra={extra} index={index} />
                    </div>
                );
            })}
            <Button
                className="normal-buttons"
                onClick={addDishExtrasHandler}
            >
                Add Extras
            </Button>
        </div>
    );
};

DishExtrasInformation.propTypes = {
    extras: PropTypes.array.isRequired,
    checkFields: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(DishExtrasInformation);
