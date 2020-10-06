/**
 * This component is used to represent each dish card in dishes
 */

import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import { Button, InputAdornment } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { AttachMoney } from '@material-ui/icons';
import NoImage from '../../../../../assets/icons/camera.png';
import { getImageLink } from '../../../../../catalog/Others';
import { DemoDishName, DemoDishPrice } from '../../../../../catalog/Demo';

const AddListDish = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { id, index, name, price, image, shortInfo, setState } = props;

    // /**
    //  * This function is used for adding image
    //  *
    //  * @param {*} event
    //  */
    // const addImage = (event) => {
    //     setState({ type: 'setImage', id, image: { file: event.target.files[0], link: URL.createObjectURL(event.target.files[0]) } });
    // };

    // /**
    //  * This function is used for removing image
    //  */
    // const removeImage = () => {
    //     setState({ type: 'setImage', index, image: { file: null, link: '' } });
    // };

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row">
                    <TextField
                        title="Dish Name"
                        label="Dish Name"
                        type="text"
                        value={name}
                        placeholder={`Ex: ${DemoDishName}`}
                        fullWidth
                        variant="outlined"
                        required
                        multiline
                        rows="1"
                        onChange={(event) => {
                            event.stopPropagation();
                            setState({ type: 'setName', index, name: event.target.value });
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    />
                </TableCell>
                <TableCell style={{ maxWidth: '200px' }} align="center">
                    <TextField
                        title="Price"
                        label="Price"
                        type="number"
                        value={price}
                        placeholder={`Ex: ${DemoDishPrice}`}
                        fullWidth
                        variant="outlined"
                        error={(parseFloat(price) < 0)}
                        required
                        InputProps={({ inputProps: { min: 0, max: 10 }, startAdornment: (<InputAdornment position="start"><AttachMoney /></InputAdornment>) })}
                        onChange={(event) => {
                            event.stopPropagation();
                            setState({ type: 'setPrice', index, price: event.target.value });
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    />
                </TableCell>
                <TableCell align="center">
                    <img className="dish-item-list-view-row-image" src={image.link ? getImageLink(image.link) : NoImage} alt={name || 'Dish Image'} />
                </TableCell>
                <TableCell align="center">
                    <TextField
                        rows="4"
                        title="Short Info"
                        label="Short Info"
                        type="text"
                        value={shortInfo}
                        fullWidth
                        variant="outlined"
                        required={false}
                        multiline
                        onChange={(event) => {
                            event.stopPropagation();
                            setState({ type: 'setShortInfo', index, shortInfo: event.target.value });
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    />
                </TableCell>
                {/* <TableCell style={{ display: 'flex', flexDirection: 'column' }} align="center">
                    <input
                        accept="image/*"
                        id={`icon-button-photo-${id}`}
                        onChange={(event) => { addImage(event, name); }}
                        type="file"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor={`icon-button-photo-${id}`}>
                        <Button
                            variant="contained"
                            style={{ minWidth: '100px', fontSize: '12px', margin: '5px auto', height: '50px' }}
                            className="normal-buttons buttons"
                            component="span"
                        >
                            Upload Image
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        style={{ minWidth: '100px', fontSize: '12px', margin: '5px auto', height: '50px' }}
                        className="normal-buttons buttons"
                        onClick={(event) => {
                            event.stopPropagation();
                            removeImage();
                        }}
                    >
                        Delete Image
                    </Button>
                </TableCell> */}
                <TableCell>
                </TableCell>
                <TableCell>
                </TableCell>
            </TableRow>
        </>
    );
};

AddListDish.propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.object.isRequired,
    shortInfo: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(AddListDish);
