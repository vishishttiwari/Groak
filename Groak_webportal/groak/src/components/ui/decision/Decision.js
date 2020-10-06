/**
 * This component is used for decision alerts
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogContent, DialogContentText, DialogActions, Button, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';

const Decision = (props) => {
    const {
        open, response, title, content,
    } = props;

    return (
        <div>
            <Dialog className="pop-up-after-restaurant" onClose={() => { response(false); }} open={open}>
                <div className="pop-up-after-restaurant-title">
                    <p>{title}</p>
                    <IconButton onClick={(
                        () => {
                            response(false);
                        })}
                    >
                        <CloseRounded className="pop-up-after-restaurant-title-close" />
                    </IconButton>
                </div>
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
                    <Button style={{ color: 'red' }} variant="outlined" onClick={() => { response(false); }}>
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
