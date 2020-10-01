/**
 * This page is used for the homescreen.
 */
import React, { useContext, useEffect, useReducer, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './css/HomePage.css';
import { Button, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import Fade from 'react-reveal/Fade';
import { context } from '../../globalState/globalState';
import Phone2 from '../../assets/images/homepage/phone_2_1.png';
import Phone3 from '../../assets/images/homepage/phone_3_1.png';
import Computer1 from '../../assets/images/homepage/computer_1.png';
import Computer2 from '../../assets/images/homepage/computer_2_1.png';
import Computer3 from '../../assets/images/homepage/computer_3_1.png';
import Computer4 from '../../assets/images/homepage/computer_4_1.png';
import { analytics } from '../../firebase/FirebaseLibrary';
import { groakTesting } from '../../catalog/Others';
import AfterRestaurantPopUp from './AfterRestaurantPopUp';

const initialState = {
    videoPopUp: false,
    afterRestaurantPopUp: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'showVideo':
            return { ...state, videoPopUp: true };
        case 'hideVideo':
            return { ...state, videoPopUp: false };
        case 'showAfterRestaurantPopUp':
            return { ...state, afterRestaurantPopUp: true };
        case 'hideAfterRestaurantPopUp':
            return { ...state, afterRestaurantPopUp: false };
        default:
            return { ...state };
    }
}

const HomePage = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const top = createRef(null);

    useEffect(() => {
        top.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
    }, [top]);

    useEffect(() => {
        if (groakTesting) {
            analytics.logEvent('visit_website_web_testing');
        } else {
            analytics.logEvent('visit_website_web');
        }
    }, []);

    // useEffect(() => {
    //     const script = document.createElement('script');
    //     script.innerHTML = `(function(w,d,v3){
    //             w.chaportConfig = {
    //             appId : '5f668771f3588379ec598cd1'
    //             };

    //             if(w.chaport)return;v3=w.chaport={};v3._q=[];v3._l={};v3.q=function(){v3._q.push(arguments)};v3.on=function(e,fn){if(!v3._l[e])v3._l[e]=[];v3._l[e].push(fn)};var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://app.chaport.com/javascripts/insert.js';var ss=d.getElementsByTagName('script')[0];ss.parentNode.insertBefore(s,ss)})(window, document);`;
    //     script.async = true;
    //     script.defer = true;
    //     script.id = 'groak-chat';

    //     document.body.appendChild(script);

    //     return () => {
    //         document.body.removeChild(script);
    //         const chatClasses = document.getElementsByClassName('chaport-container');
    //         if (chatClasses && chatClasses.length > 0) {
    //             document.body.removeChild(chatClasses[0]);
    //         }
    //     };
    // }, []);

    return (
        <div className="homepage">
            <div className="pop-up">
                <div className={state.videoPopUp ? 'content show' : 'content hide'}>
                    <div className="heading">
                        <h1>Demo video</h1>
                        <IconButton onClick={() => { setState({ type: 'hideVideo' }); }}>
                            <CloseRounded />
                        </IconButton>
                    </div>
                    <iframe
                        title="Groak Demo Video"
                        className="video"
                        src="https://www.youtube.com/embed/kQWfG12INfM"
                        allowFullScreen
                    >
                    </iframe>
                </div>
            </div>
            {globalState.scannedCustomer ? (
                <AfterRestaurantPopUp
                    restaurantId={globalState.restaurantIdCustomer}
                    restaurantName={globalState.restaurantCustomer.name}
                    orderingAllowed={globalState.orderAllowedCustomer}
                    afterRestaurantPopUp={state.afterRestaurantPopUp}
                    setState={setState}
                />
            ) : null}

            <div className="firstsection">
                <p ref={top}> </p>
                <Fade left>
                    <div className="firstsection-content">
                        <div className="firstsection-topic">
                            <h1>Your Free Contactless Dining Experience</h1>
                            <h2>Re-Open Your Restaurant! Simple, Safe &#38; 100% Touch Free!</h2>
                        </div>
                        <div className="firstsection-buttons">
                            {globalState.userPortal == null || !globalState.userPortal
                                ? (
                                    <>
                                        <Button
                                            className="button"
                                            onClick={() => { history.push('/requestademo'); }}
                                            type="button"
                                        >
                                            REQUEST A DEMO
                                        </Button>
                                        <Button
                                            className="button"
                                            onClick={() => { setState({ type: 'showVideo' }); }}
                                            type="button"
                                        >
                                            WATCH VIDEO
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            className="button"
                                            onClick={() => { history.push('/contactus'); }}
                                            type="button"
                                        >
                                            CONTACT US
                                        </Button>
                                        <Button
                                            className="button"
                                            onClick={() => { history.push('/orders'); }}
                                            type="button"
                                        >
                                            ORDERS
                                        </Button>
                                    </>
                                ) }
                        </div>
                    </div>
                </Fade>
            </div>
            <Fade right>
                <div className="whiteBackground sections verticallyCenter right">
                    <img src={Computer1} alt="Groak - Computer demo 2" />
                    <div className="text">
                        <p className="sections-topic">Customizable QR Menu Creation</p>
                        <p className="sections-subtopic">Generate customizable QR code menus with designs of your choice for each of your tables. No more third party QR code providers. Create your own QR menus for your restaurant</p>
                    </div>
                </div>
            </Fade>
            <Fade left>
                <div className="primaryColorBackground sections verticallyCenter left">
                    <div className="text">
                        <p className="sections-topic">Digital Menu Experience</p>
                        <p className="sections-subtopic">Connect your customers directly to your digital menu so they can view, order, and check-out on their smartphone. Seamlessly integrate customer orders to your POS system</p>
                    </div>
                    <img src={Phone3} alt="Groak - Computer demo 2" />
                </div>
            </Fade>
            <Fade right>
                <div className="whiteBackground sections verticallyCenter right">
                    <img src={Computer4} alt="Groak - Computer demo 2" />
                    <div className="text">
                        <p className="sections-topic">Customize your Digital Menu. Anytime, Anyplace, Anywhere!</p>
                        <p className="sections-subtopic">Create a contactless digital menu experience for your customers. Update menu items anytime from your device, with immediate display of menu updates to your customers!</p>
                    </div>
                </div>
            </Fade>
            <Fade left>
                <div className="primaryColorBackground sections verticallyCenter left">
                    <div className="text">
                        <p className="sections-topic">Flexible Service Management</p>
                        <p className="sections-subtopic">Enable your staff to provide status updates about service and order deliveries to your customers. Interact with your customers with our live chat feature to minimize contact and health risks</p>
                    </div>
                    <img src={Computer3} alt="Groak - Computer demo 3" />
                </div>
            </Fade>
            <Fade right>
                <div className="whiteBackground sections verticallyCenter right">
                    <img src={Computer2} alt="Groak - Computer demo 3" />
                    <div className="text">
                        <p className="sections-topic">Best in-class Table Management System</p>
                        <p className="sections-subtopic">Easily manage dining operations with our seamless table management system. Every digital order your customers place immediately reaches our system with accurate detail</p>
                    </div>
                </div>
            </Fade>
            <Fade left>
                <div className="primaryColorBackground sections verticallyCenter left">
                    <div className="text">
                        <p className="sections-topic">Automatic receipt generation</p>
                        <p className="sections-subtopic">Automated receipt generation, sent directly to your customer&#39;s phone</p>
                    </div>
                    <img src={Phone2} alt="Groak - Phone demo 2" />
                </div>
            </Fade>
        </div>
    );
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(HomePage));
