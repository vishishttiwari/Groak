/**
 * This component is used for decision alerts
 */
import React from 'react';
import PropTypes from 'prop-types';

import { DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

const Decision = (props) => {
    const {
        open, response, title, content,
    } = props;

    return (
        <div>
            <Dialog onClose={() => { response(false); }} open={open}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => { response(true); }}>
                        Yes
                    </Button>
                </DialogActions>
                <DialogActions>
                    <Button variant="outlined" onClick={() => { response(false); }} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

Decision.propTypes = {
    open: PropTypes.bool.isRequired,
    response: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default Decision;
