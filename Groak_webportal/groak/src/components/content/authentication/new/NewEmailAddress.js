/**
 * This page is used for changing the email address.
 */
import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import '../css/Authentication.css';
import { TextField, Button } from '@material-ui/core';
import { changeEmailAPICall } from '../AuthenticationAPICalls';
import Spinner from '../../../ui/spinner/Spinner';
import { context } from '../../../../globalState/globalState';
import { checkEmailValidity } from '../../../../catalog/Validity';
import * as NotificationsComments from '../../../../catalog/NotificationsComments';
import { ValidEmailComment } from '../../../../catalog/Comments';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';

const localDefaultState = { email1: '', email2: '', loadingSpinner: false };

function localReducer(state, action) {
    switch (action.type) {
        case 'setEmail1':
            return { ...state, email1: action.email };
        case 'setEmail2':
            return { ...state, email2: action.email };
        case 'removeEmail':
            return { ...state, email1: '', email2: '' };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return localDefaultState;
    }
}

const NewEmailAddress = (props) => {
    const { classes, history } = props;
    const [state, setState] = useReducer(localReducer, localDefaultState);
    const { setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function first checks if the email is correct and then calls the api to change it. The api then sends
     * an email to the new email address and also logs out the user.
     *
     * @param {*} event this is received from the submit button.
     */
    async function changeEmailAddressHandler(event) {
        event.preventDefault();
        if (state.email1.length === 0 || state.email2.length === 0) {
            enqueueSnackbar(NotificationsComments.NoEmail, { variant: 'error' });
            return;
        }
        if (state.email1 !== state.email2) {
            enqueueSnackbar(NotificationsComments.NotSameEmail, { variant: 'error' });
            return;
        }
        if (checkEmailValidity(state.email1, setState, enqueueSnackbar) && checkEmailValidity(state.email2, setState, enqueueSnackbar)) {
            await changeEmailAPICall(state.email1, history, setState, setGlobalState, enqueueSnackbar);
        }
    }

    return (
        <div className="authentication">
            <form>
                <TextField
                    label="Email"
                    type="email"
                    value={state.email1}
                    required
                    fullWidth
                    margin="normal"
                    shrink={(state.email1.length > 0).toString()}
                    variant="outlined"
                    autoFocus
                    onChange={(event) => { setState({ type: 'setEmail1', email: event.target.value.toLowerCase() }); }}
                    InputLabelProps={textFieldLabelProps(classes)}
                />
                <TextField
                    label="Enter email again"
                    type="email"
                    value={state.email2}
                    required
                    fullWidth
                    margin="normal"
                    shrink={(state.email2.length > 0).toString()}
                    variant="outlined"
                    onChange={(event) => { setState({ type: 'setEmail2', email: event.target.value.toLowerCase() }); }}
                    InputLabelProps={textFieldLabelProps(classes)}
                    helperText={ValidEmailComment}
                />
                <Button
                    className="submit-button"
                    onClick={changeEmailAddressHandler}
                    type="submit"
                >
                    Save Email
                </Button>
            </form>
            <Spinner show={state.loadingSpinner} />
        </div>
    );
};

NewEmailAddress.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(NewEmailAddress)));
