/**
 * This page is used for the sign in screen.
 */
import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import '../css/Authentication.css';
import { TextField, Button } from '@material-ui/core';
import { signinAPICall } from '../AuthenticationAPICalls';
import Spinner from '../../../ui/spinner/Spinner';
import { context } from '../../../../globalState/globalState';
import { checkPasswordValidity, checkEmailValidity } from '../../../../catalog/Validity';
import * as NotificationsComments from '../../../../catalog/NotificationsComments';
import { TextFieldLabelStyles, textFieldLabelPropsShrink } from '../../../../catalog/Others';
import { TroubleSigningIn, NoAccount } from '../../../../catalog/Comments';

const localDefaultState = { email: '', password: '', loadingSpinner: false };

function localReducer(state, action) {
    switch (action.type) {
        case 'setEmail':
            return { ...state, email: action.email };
        case 'setPassword':
            return { ...state, password: action.password };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'removePassword':
            return { ...state, password: '' };
        default:
            return localDefaultState;
    }
}

const SignIn = (props) => {
    const { classes, history } = props;
    const [state, setState] = useReducer(localReducer, localDefaultState);
    const { setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * The function first checks if the email and password entered is valid or not and then logs in the user provided
     * he is verified from the backend.
     * @param {*} event this is received from the submit button.
     */
    async function login(event) {
        event.preventDefault();
        if (state.email.length === 0) {
            enqueueSnackbar(NotificationsComments.NoEmail, { variant: 'error' });
            return;
        }
        if (state.password.length === 0) {
            enqueueSnackbar(NotificationsComments.NoPassword, { variant: 'error' });
            return;
        }
        if (checkEmailValidity(state.email, setState, enqueueSnackbar) && checkPasswordValidity(state.password, setState, enqueueSnackbar)) {
            await signinAPICall(state.email, state.password, history, setState, setGlobalState, enqueueSnackbar);
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
                    InputLabelProps={textFieldLabelPropsShrink(classes)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={state.password}
                    required
                    fullWidth
                    margin="normal"
                    shrink={(state.password.length > 0).toString()}
                    variant="outlined"
                    onChange={(event) => { setState({ type: 'setPassword', password: event.target.value }); }}
                    InputLabelProps={textFieldLabelPropsShrink(classes)}
                />
                <Button
                    className="submit-button"
                    onClick={login}
                    type="submit"
                >
                    Sign in
                </Button>
                <div className="other-buttons">
                    <button type="button" onClick={() => { history.push('/newpassword'); }}>{TroubleSigningIn}</button>
                    <button type="button" onClick={() => { history.push('/signup'); }}>{NoAccount}</button>
                </div>
            </form>
            <Spinner show={state.loadingSpinner} />
        </div>
    );
};

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(SignIn)));
