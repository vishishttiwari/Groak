/**
 * This component is used for the buttons at the bottom of the page
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Delete } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import Decision from '../../../ui/decision/Decision';
import { uploadButtonStyle } from '../../../../catalog/Others';
import { DeleteDishPopUp, DeleteDishPopUpTitle } from '../../../../catalog/NotificationsComments';

const DishDetailsMainButtons = (props) => {
    const { goBackHandler, submitHandler, deleteHandler, newDish } = props;
    const [deletePermission, setDeletePermission] = useState(false);

    /**
     * This function is called when the delete button is pressed
     *
     * @param {*} granted this tells if the user has granted permission to delete in the popup
     */
    const userPermissionResponse = (granted) => {
        if (granted) {
            deleteHandler();
        }
        setDeletePermission(false);
    };

    return (
        <>
            <Decision open={deletePermission} response={userPermissionResponse} title={DeleteDishPopUpTitle} content={DeleteDishPopUp} />
            <div className="dish-details-main-buttons">
                <div className="dish-details-cancel-submit-buttons">
                    <Button
                        className="cancel-buttons"
                        onClick={goBackHandler}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="success-buttons"
                        type="submit"
                        onClick={submitHandler}
                    >
                        {newDish ? 'Add Dish' : 'Save Changes'}
                    </Button>
                </div>
                {newDish ? null
                    : (
                        <Button
                            className="delete-buttons"
                            variant="contained"
                            onClick={() => { setDeletePermission(true); }}
                        >
                            Delete Dish
                            <Delete className={uploadButtonStyle().rightIcon} />
                        </Button>
                    )}
            </div>
        </>
    );
};

DishDetailsMainButtons.propTypes = {
    goBackHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    newDish: PropTypes.bool.isRequired,
};

export default React.memo(DishDetailsMainButtons);
