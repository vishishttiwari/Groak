/**
 * This component is used to represent each dish card in categories
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import NoImage from '../../../../../assets/icons/camera.png';
import { getImageLink, getPrice } from '../../../../../catalog/Others';

const ListDish = (props) => {
    const { dishItem, dishDetailHandler, checked, addToCheckedDish } = props;

    return (
        <TableRow
            className="dishes-list-view-row"
            onClick={dishDetailHandler}
        >
            <TableCell style={{ minWidth: '200px' }} component="th" scope="row">
                {dishItem.name}
            </TableCell>
            <TableCell style={{ minWidth: '150px' }} align="center">
                {getPrice(dishItem.price)}
            </TableCell>
            <TableCell align="center">
                <img className="dish-item-list-view-row-image" src={dishItem.image ? getImageLink(dishItem.image) : NoImage} alt={dishItem.name || 'Dish Image'} />
            </TableCell>
            <TableCell align="center">
                {dishItem.shortInfo}
            </TableCell>
            <TableCell align="center">
                <Checkbox
                    className="check-box"
                    icon={<CheckBoxOutlineBlank fontSize="large" />}
                    checkedIcon={<CheckBox className="check-box" fontSize="large" />}
                    checked={checked}
                    onChange={(event) => { addToCheckedDish(event, dishItem.reference.path); }}
                    onClick={(event) => { event.stopPropagation(); }}
                />
            </TableCell>
        </TableRow>
    );
};

ListDish.propTypes = {
    dishItem: PropTypes.object.isRequired,
    dishDetailHandler: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    addToCheckedDish: PropTypes.func.isRequired,
};

export default React.memo(ListDish);
