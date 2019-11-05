/**
 * This class is part of the settings page that shows the account information and logout button.
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';

import { context } from '../../../globalState/globalState';

import './css/Settings.css';
import { signoutAPICall, changePasswordAPICall } from '../authentication/AuthenticationAPICalls';

const AccountSettings = (props) => {
    const { history } = props;
    const { globalState, setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function is called when the change password button is pressed.
     * This function sends an email to the user's email for changing password
     * and also logs out the user.
     */
    const changePasswordAddressHandler = async () => {
        await changePasswordAPICall(globalState.email, history, setGlobalState, enqueueSnackbar);
    };

    /**
     * This function logs out the user, redirects to signin and sets the global state to null.
     */
    const logout = async () => {
        await signoutAPICall(history, setGlobalState, enqueueSnackbar);
    };

    return (
        <div className="account-settings">
            <h2>Account Information</h2>
            <Button
                className="normal-buttons"
                variant="contained"
                onClick={() => { history.push('/newemail'); }}
            >
                Change Email Address
            </Button>
            <Button
                className="normal-buttons"
                variant="contained"
                onClick={changePasswordAddressHandler}
            >
                Reset Password
            </Button>
            <Button
                className="delete-buttons"
                variant="contained"
                onClick={logout}
            >
                Logout
            </Button>
            <Button
                className="cancel-buttons"
                variant="contained"
                onClick={() => { history.goBack(); }}
            >
                Go Back
            </Button>
        </div>
    );
};

AccountSettings.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(AccountSettings));
