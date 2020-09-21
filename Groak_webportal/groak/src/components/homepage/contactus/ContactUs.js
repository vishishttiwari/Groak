/**
 * This page is used for the contact us page.
 */
import React, { useReducer, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';

import './css/ContactUs.css';
import { Button, TextField } from '@material-ui/core';
import emailjs from 'emailjs-com';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Spinner from '../../ui/spinner/Spinner';
import * as NotificationsComments from '../../../catalog/NotificationsComments';
// import { checkEmailValidity } from '../../../catalog/Validity';

const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    loadingSpinner: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setFirstName':
            return { ...state, firstName: action.firstName };
        case 'setLastName':
            return { ...state, lastName: action.lastName };
        case 'setEmail':
            return { ...state, email: action.email };
        case 'setPhone':
            return { ...state, phone: action.phone };
        case 'setMessage':
            return { ...state, message: action.message };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        default:
            return { ...state };
    }
}

const ContactUs = (props) => {
    const { history, title } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { enqueueSnackbar } = useSnackbar();
    const top = createRef(null);

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
    }, [top]);

    /**
     * This function is used for sending data to email using php script
     *
     * @param {*} event this is received from the submit button.
     */
    async function sendContactInfo(event) {
        event.preventDefault();
        // if (state.firstName.length === 0) {
        //     enqueueSnackbar(NotificationsComments.ErrorContactInfoFirstName, { variant: 'error' });
        //     return;
        // }
        // if (state.lastName.length === 0) {
        //     enqueueSnackbar(NotificationsComments.ErrorContactInfoLastName, { variant: 'error' });
        //     return;
        // }
        // if (state.email.length === 0) {
        //     enqueueSnackbar(NotificationsComments.ErrorContactInfoEmailName, { variant: 'error' });
        //     return;
        // }
        // if (state.phone.length < 6) {
        //     enqueueSnackbar(NotificationsComments.ErrorContactInfoPhoneName, { variant: 'error' });
        //     return;
        // }
        // if (state.message.length === 0) {
        //     enqueueSnackbar(NotificationsComments.ErrorContactInfoMessageName, { variant: 'error' });
        //     return;
        // }
        // if (checkEmailValidity(state.email, setState, enqueueSnackbar)) {
        emailjs.send('gmail', 'template_Pyu60ksL', state, 'user_ESRgcuOOSQDmfF2WelZzP')
            .then(() => {
                enqueueSnackbar(NotificationsComments.MessageSent, { variant: 'success' });
                history.replace('/');
            }, () => {
                enqueueSnackbar(NotificationsComments.ErrorMessageSent, { variant: 'error' });
            });
        // }
    }

    return (
        <>
            <p ref={top}> </p>
            <div className="contactus">
                <div className="content">
                    <div className="title">
                        <h1>
                            {title || 'Contact Us'}
                        </h1>
                    </div>
                    <form>
                        <div className="fields">
                            <TextField
                                value={state.firstName}
                                onChange={(event) => { setState({ type: 'setFirstName', firstName: event.target.value }); }}
                                fullWidth
                                type="text"
                                margin="normal"
                                className="firstname"
                                label="First Name"
                                variant="outlined"
                            />
                            <TextField
                                value={state.lastName}
                                onChange={(event) => { setState({ type: 'setLastName', lastName: event.target.value }); }}
                                fullWidth
                                type="text"
                                margin="normal"
                                className="lastname"
                                label="Last Name"
                                variant="outlined"
                            />
                            <TextField
                                value={state.email}
                                onChange={(event) => { setState({ type: 'setEmail', email: event.target.value }); }}
                                fullWidth
                                type="email"
                                margin="normal"
                                className="email"
                                label="Email Address"
                                variant="outlined"
                            />
                            <PhoneInput
                                containerClass="phone"
                                inputClass="phone"
                                country="us"
                                value={state.phone}
                                onChange={(phone) => { setState({ type: 'setPhone', phone }); }}
                                fullWidth
                                type="number"
                            />
                            <TextField
                                value={state.message}
                                onChange={(event) => { setState({ type: 'setMessage', message: event.target.value }); }}
                                fullWidth
                                type="text"
                                margin="normal"
                                className="message"
                                label="Message"
                                variant="outlined"
                                multiline
                                rows={10}
                            />
                        </div>
                        <div className="sendbutton">
                            <Button
                                onClick={sendContactInfo}
                                className="success-buttons"
                                type="submit"
                                label="Standard"
                            >
                                Send
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Spinner show={state.loadingSpinner} />
        </>
    );
};

ContactUs.propTypes = {
    title: PropTypes.string,
    history: PropTypes.object.isRequired,
};

ContactUs.defaultProps = {
    title: 'Contact Us',
};

export default withRouter(React.memo(ContactUs));
