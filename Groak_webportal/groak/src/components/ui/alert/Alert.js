/**
 * This component is used for alerts
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogContent, DialogContentText, DialogActions, Button, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

const Alert = (props) => {
    const {
        open, setOpen, title, content,
    } = props;
    return (
        <div>
            <Dialog className="pop-up-after-restaurant" onClose={() => { setOpen(false); }} open={open}>
                closeHandler
                <div className="pop-up-after-restaurant-title">
                    <p>{title}</p>
                    <IconButton onClick={() => { setOpen(false); }}>
                        <CloseRounded className="pop-up-after-restaurant-title-close" />
                    </IconButton>
                </div>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpen(false); }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

Alert.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Alert;
