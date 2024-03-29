/**
 * This class is part of Dish Details that is used for displaying the restrictions of dishes such as vegetarian. vegan etc.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Select, OutlinedInput } from '@material-ui/core';
import { DishVegetarian, DishVegan, DishGlutenFree, DishKosher, DishSeaFood } from '../../../../catalog/Comments';

const DishRestrictionInformation = (props) => {
    const { showTitle, vegetarian, vegan, glutenFree, kosher, seaFood, setState } = props;

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
        {
            key: 'seaFood',
            title: DishSeaFood,
            value: seaFood,
            onChange: (event) => { setState({ type: 'setSeaFood', seaFood: event.target.value }); },
        },
    ];

    return (
        <div className="dish-restriction-information">
            {showTitle ? <h2>Other Info:</h2> : null}
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
    showTitle: PropTypes.bool.isRequired,
    vegetarian: PropTypes.string.isRequired,
    vegan: PropTypes.string.isRequired,
    glutenFree: PropTypes.string.isRequired,
    kosher: PropTypes.string.isRequired,
    seaFood: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(DishRestrictionInformation);
