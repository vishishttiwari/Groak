/**
 * This page is for the sign up screen.
 */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import '../css/Authentication.css';
import { TextField, Button } from '@material-ui/core';
import { signupAPICall } from '../AuthenticationAPICalls';
import Address from './Address';
import Spinner from '../../../ui/spinner/Spinner';
import { checkPasswordValidity, checkEmailValidity } from '../../../../catalog/Validity';
import { TextFieldLabelStyles, textFieldLabelProps } from '../../../../catalog/Others';
import * as NotificationsComments from '../../../../catalog/NotificationsComments';

const initialState = {
    email: '',
    password: '',
    restaurantName: '',
    address: {
        displayAddress: '',
        formattedAddress: '',
        streetNumber: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        latitude: -1000,
        longitude: -1000,
    },
    location: {
        latitude: -1000,
        longitude: -1000,
    },
    loadingSpinner: false,
};

function reducer(state, action) {
    let updatedAddress;
    switch (action.type) {
        case 'setEmail':
            return { ...state, email: action.email };
        case 'setPassword':
            return { ...state, password: action.password };
        case 'setRestaurantName':
            return { ...state, restaurantName: action.restaurantName };
        case 'setDisplayAddress':
            updatedAddress = {
                ...state.address,
                displayAddress: action.displayAddress,
            };
            return { ...state, address: updatedAddress };
        case 'setAddress':
            updatedAddress = {
                ...state.address,
                displayAddress: action.displayAddress,
                formattedAddress: action.formattedAddress,
                streetNumber: action.streetNumber,
                street: action.street,
                city: action.city,
                state: action.state,
                country: action.country,
                postalCode: action.postalCode,
                latitude: action.latitude,
                longitude: action.longitude,
            };
            return { ...state, address: updatedAddress };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'removePassword':
            return { ...state, password: '' };
        default:
            return initialState;
    }
}

const SignUp = (props) => {
    const { classes, history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function checks if all the data entered is correct or not and then uploads the user.
     * It also sends the email verification, adds demo restaurant to the backend and then logs out
     * the user.
     *
     * @param {*} event this is received from the submit button.
     */
    async function signup(event) {
        event.preventDefault();
        if (state.email.length === 0) {
            enqueueSnackbar(NotificationsComments.NoEmail, { variant: 'error' });
            return;
        }
        if (state.password.length === 0) {
            enqueueSnackbar(NotificationsComments.NoPassword, { variant: 'error' });
            return;
        }
        if (state.restaurantName.length === 0) {
            enqueueSnackbar(NotificationsComments.NoRestaurantName, { variant: 'error' });
            return;
        }
        if (state.address == null || state.address.latitude == null || !state.address.longitude == null || state.address.latitude === -1000 || state.address.longitude === -1000) {
            enqueueSnackbar(NotificationsComments.InvalidRestaurantAddress, { variant: 'error' });
            return;
        }
        if (checkEmailValidity(state.email, setState, enqueueSnackbar) && checkPasswordValidity(state.password, setState, enqueueSnackbar)) {
            await signupAPICall(history, state, setState, enqueueSnackbar);
        }
    }

    return (
        <>
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
                        InputLabelProps={textFieldLabelProps(classes)}
                    />
                    <TextField
                        label="Restaurant Name"
                        type="text"
                        value={state.restaurantName}
                        required
                        fullWidth
                        margin="normal"
                        shrink={(state.restaurantName.length > 0).toString()}
                        variant="outlined"
                        onChange={(event) => { setState({ type: 'setRestaurantName', restaurantName: event.target.value }); }}
                        InputLabelProps={textFieldLabelProps(classes)}
                    />
                    <Address address={state.address} setAddress={setState} />
                    <Button
                        className="submit-button"
                        onClick={signup}
                        type="submit"
                    >
                        Create Account
                    </Button>
                    <div className="other-buttons">
                        <button type="button" onClick={() => { history.push('/signin'); }}>Already have an account?</button>
                    </div>
                </form>
                <Spinner show={state.loadingSpinner} />
            </div>
        </>
    );
};

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(SignUp)));
