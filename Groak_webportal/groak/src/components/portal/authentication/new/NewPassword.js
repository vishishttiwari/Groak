/**
 * This page is used for changing password at the email address provided.
 */
import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import '../css/Authentication.css';
import { TextField, Button } from '@material-ui/core';
import { changePasswordAPICall } from '../AuthenticationAPICalls';
import Spinner from '../../../ui/spinner/Spinner';
import { context } from '../../../../globalState/globalState';
import { checkEmailValidity } from '../../../../catalog/Validity';
import * as NotificationsComments from '../../../../catalog/NotificationsComments';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';

const localDefaultState = { email: '', loadingSpinner: false };

function localReducer(state, action) {
    switch (action.type) {
        case 'setEmail':
            return { ...state, email: action.email };
        case 'removeEmail':
            return { ...state, email: '' };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return localDefaultState;
    }
}

const NewPassword = (props) => {
    const { classes, history } = props;
    const [state, setState] = useReducer(localReducer, localDefaultState);
    const { setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function first checks if the email is correct and then calls the api to change it. The api then sends
     * an email to the email address provided to change password and also logs out the user.
     *
     * @param {*} event this is received from the submit button.
     */
    async function changeEmailAddressHandler(event) {
        event.preventDefault();
        if (state.email.length === 0) {
            enqueueSnackbar(NotificationsComments.NoEmail, { variant: 'error' });
            return;
        }
        if (checkEmailValidity(state.email, setState, enqueueSnackbar)) {
            await changePasswordAPICall(state.email, history, setState, setGlobalState, enqueueSnackbar);
        }
    }

    return (
        <div className="authentication">
            <form>
                <TextField
                    label="Email"
                    type="email"
                    value={state.email}
                    required
                    fullWidth
                    margin="normal"
                    shrink={(state.email.length > 0).toString()}
                    variant="outlined"
                    autoFocus
                    onChange={(event) => { setState({ type: 'setEmail', email: event.target.value.toLowerCase() }); }}
                    InputLabelProps={textFieldLabelProps(classes)}
                />
                <Button
                    className="submit-button"
                    onClick={changeEmailAddressHandler}
                    type="submit"
                >
                    Reset Password
                </Button>
            </form>
            <Spinner show={state.loadingSpinner} />
        </div>
    );
};

NewPassword.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(NewPassword)));
