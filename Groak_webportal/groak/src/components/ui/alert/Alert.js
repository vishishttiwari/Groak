/**
 * This component is used for alerts
 */
import React from 'react';
import PropTypes from 'prop-types';

import { DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const Alert = (props) => {
    const {
        open, setOpen, title, content,
    } = props;
    return (
        <div>
            <Dialog onClose={() => { setOpen(false); }} open={open}>
                <DialogTitle>{title}</DialogTitle>
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
