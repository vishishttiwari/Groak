/**
 * This class is part of Dish Details that is used for displaying the restrictions of dishes such as vegetarian. vegan etc.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Select, OutlinedInput } from '@material-ui/core';
import { DishVegetarian, DishVegan, DishGlutenFree, DishKosher } from '../../../../catalog/Comments';

const DishRestrictionInformation = (props) => {
    const { vegetarian, vegan, glutenFree, kosher, setState } = props;

    const options = ['Not Sure', 'Yes', 'No'];

    const allergies = [
        {
            key: 'vegetarian',
            title: DishVegetarian,
            value: vegetarian,
            onChange: (event) => { setState({ type: 'setVegetarian', vegetarian: event.target.value }); },
        },
        {
            key: 'vegan',
            title: DishVegan,
            value: vegan,
            onChange: (event) => { setState({ type: 'setVegan', vegan: event.target.value }); },
        },
        {
            key: 'gluten-free',
            title: DishGlutenFree,
            value: glutenFree,
            onChange: (event) => { setState({ type: 'setGlutenFree', glutenFree: event.target.value }); },
        },
        {
            key: 'kosher',
            title: DishKosher,
            value: kosher,
            onChange: (event) => { setState({ type: 'setKosher', kosher: event.target.value }); },
        },
    ];

    return (
        <div className="dish-restriction-information">
            <h2>Other Info:</h2>
            {allergies.map((allergy) => {
                return (
                    <React.Fragment key={allergy.key}>
                        <p>{`${allergy.title}:`}</p>
                        <Select
                            native
                            fullWidth
                            value={allergy.value}
                            onChange={allergy.onChange}
                            input={<OutlinedInput />}
                        >
                            {options.map((option) => {
                                return (<option key={option} value={option}>{option}</option>);
                            })}
                        </Select>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

DishRestrictionInformation.propTypes = {
    vegetarian: PropTypes.string.isRequired,
    vegan: PropTypes.string.isRequired,
    glutenFree: PropTypes.string.isRequired,
    kosher: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(DishRestrictionInformation);
