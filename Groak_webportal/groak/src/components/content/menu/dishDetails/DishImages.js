/**
 * This class is part of Dish Details that is used for displaying the dish image
 */
import React from 'react';
import PropTypes from 'prop-types';

import { CloudUpload, CloseRounded } from '@material-ui/icons';
import { Button, IconButton } from '@material-ui/core';

import { uploadButtonStyle, getImageLink } from '../../../../catalog/Others';
import { DishImageDescription } from '../../../../catalog/Comments';

const DishImage = (props) => {
    const { image, name, setState } = props;

    /**
     * This function is used for adding image
     *
     * @param {*} event this is received from the input button
     */
    const addImage = (event) => {
        setState({ type: 'setImage', image: { file: event.target.files[0], link: URL.createObjectURL(event.target.files[0]) } });
    };

    /**
     * This function is used for removing image
     */
    const removeImage = () => {
        setState({ type: 'setImage', image: { file: null, link: '' } });
    };

    return (
        <div className="dish-images">
            <h2>Dish Image:</h2>
            <input
                accept="image/*"
                id="icon-button-photo"
                onChange={addImage}
                type="file"
                style={{ display: 'none' }}
            />
            <label htmlFor="icon-button-photo">
                <Button
                    className="normal-buttons"
                    variant="contained"
                    component="span"
                >
                    Upload Image
                    <CloudUpload className={uploadButtonStyle().rightIcon} />
                </Button>
            </label>
            <p>{DishImageDescription}</p>
            {image && image.link ? (
                <div className="image-container">
                    <IconButton onClick={removeImage}><CloseRounded /></IconButton>
                    <img src={getImageLink(image.link)} alt={name || 'Dish Image'} />
                </div>
            ) : null}
        </div>
    );
};

DishImage.propTypes = {
    image: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
};

export default React.memo(DishImage);
