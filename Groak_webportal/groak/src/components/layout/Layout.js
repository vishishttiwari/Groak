/**
 * This function shows all the components. This checks the authentication and if user is not authenticated
 * then it redirects it to sign in, otherwise it just shows the spinner
 */
import React, { useEffect, useContext, useReducer } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Topbar from '../navigation/topbar/Topbar';
import { context } from '../../globalState/globalState';

import './css/Layout.css';
import Spinner from '../ui/spinner/Spinner';
import { checkAuthentication } from '../portal/authentication/AuthenticationAPICalls';

const initialState = { allowedURLSegmentsState: false };

function reducer(state, action) {
    switch (action.type) {
        case 'allowedURLSegmentsState':
            return { allowedURLSegmentsState: true };
        case 'notAllowedURLSegmentsState':
            return { allowedURLSegmentsState: false };
        default:
            return initialState;
    }
}

const Layout = (props) => {
    const { allowedURLSegments, children, history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState, setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const firstSegment = history.location.pathname.split('/')[1];
        if (!allowedURLSegments.includes(firstSegment)) {
            setState({ type: 'notAllowedURLSegmentsState' });
            checkAuthentication(history, setGlobalState, enqueueSnackbar);
        } else {
            setState({ type: 'allowedURLSegmentsState' });
        }
    }, [history, setGlobalState, enqueueSnackbar]);

    // useEffect(() => {
    //     const path = history.location.pathname.split('/')[1];
    //     const script = document.createElement('script');
    //     const chatClasses = document.getElementsByClassName('chaport-container');

    //     if (path !== 'customer' && path !== 'customermenu' && (!chatClasses || chatClasses.length === 0)) {
    //         script.innerHTML = `(function(w,d,v3){
    //             w.chaportConfig = {
    //             appId : '5f668771f3588379ec598cd1'
    //             };

    //             if(w.chaport)return;v3=w.chaport={};v3._q=[];v3._l={};v3.q=function(){v3._q.push(arguments)};v3.on=function(e,fn){if(!v3._l[e])v3._l[e]=[];v3._l[e].push(fn)};var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://app.chaport.com/javascripts/insert.js';var ss=d.getElementsByTagName('script')[0];ss.parentNode.insertBefore(s,ss)})(window, document);`;
    //         script.async = true;
    //         script.defer = true;
    //         script.id = 'groak-chat';

    //         document.body.appendChild(script);
    //     } else if (path === 'customer') {
    //         if (document.getElementById('groak-chat')) {
    //             document.body.removeChild(document.getElementById('groak-chat'));
    //         }
    //         if (chatClasses && chatClasses.length > 0) {
    //             document.body.removeChild(chatClasses[0]);
    //         }
    //     }
    // }, [history.location.pathname]);

    return (
        <div className="main-container">
            <Topbar />
            <main>
                {(globalState.userPortal !== false || state.allowedURLSegmentsState) ? children : <Spinner show />}
            </main>
        </div>
    );
};

Layout.propTypes = {
    allowedURLSegments: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(Layout));
