/**
 * This component is used for the buttons at the bottom of the page
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Delete } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import Decision from '../../../ui/decision/Decision';
import { uploadButtonStyle } from '../../../../catalog/Others';
import { DeleteCategoryPopUp, DeleteCategoryPopUpTitle } from '../../../../catalog/NotificationsComments';

const CategoryDetailsMainButtons = (props) => {
    const { goBackHandler, submitHandler, deleteHandler, newCategory } = props;
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
            <Decision open={deletePermission} response={userPermissionResponse} title={DeleteCategoryPopUpTitle} content={DeleteCategoryPopUp} />
            <div className="category-details-main-buttons">
                <div className="category-details-cancel-submit-buttons">
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
                        {newCategory ? 'Add Category' : 'Save Changes'}
                    </Button>
                </div>
                {newCategory ? null
                    : (
                        <Button
                            className="delete-buttons"
                            variant="contained"
                            onClick={() => { setDeletePermission(true); }}
                        >
                            Delete Category
                            <Delete className={uploadButtonStyle().rightIcon} />
                        </Button>
                    )}
            </div>
        </>
    );
};

CategoryDetailsMainButtons.propTypes = {
    goBackHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    newCategory: PropTypes.bool.isRequired,
};

export default React.memo(CategoryDetailsMainButtons);
