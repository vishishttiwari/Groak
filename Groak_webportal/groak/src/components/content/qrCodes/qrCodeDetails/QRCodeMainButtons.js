/**
 * This component is used for the buttons at the bottom of the page
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Delete } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import Decision from '../../../ui/decision/Decision';
import { uploadButtonStyle } from '../../../../catalog/Others';
import { DeleteQRCodePopUpTitle, DeleteQRCodePopUp } from '../../../../catalog/NotificationsComments';

const QRCodeMainButtons = (props) => {
    const { goBackHandler, submitHandler, deleteHandler, newQRCode } = props;
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
            <Decision open={deletePermission} response={userPermissionResponse} title={DeleteQRCodePopUpTitle} content={DeleteQRCodePopUp} />
            <div className="qrcode-details-main-buttons">
                <div className="qrcode-details-cancel-submit-buttons">
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
                        {newQRCode ? 'Add QR Code' : 'Save Changes'}
                    </Button>
                </div>
                {newQRCode ? null
                    : (
                        <Button
                            className="delete-buttons"
                            variant="contained"
                            onClick={() => { setDeletePermission(true); }}
                        >
                            Delete QR Code
                            <Delete className={uploadButtonStyle().rightIcon} />
                        </Button>
                    )}
            </div>
        </>
    );
};

QRCodeMainButtons.propTypes = {
    goBackHandler: PropTypes.func.isRequired,
    submitHandler: PropTypes.func.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    newQRCode: PropTypes.bool.isRequired,
};

export default React.memo(QRCodeMainButtons);
