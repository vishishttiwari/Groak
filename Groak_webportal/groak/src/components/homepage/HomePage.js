/**
 * This page is used for the homescreen.
 */
import React, { useContext, useEffect, useReducer, createRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './css/HomePage.css';
import { Button, IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import { context } from '../../globalState/globalState';
import Phone2 from '../../assets/images/homepage/phone_2_1.png';
import Phone3 from '../../assets/images/homepage/phone_3_1.png';
import Computer1 from '../../assets/images/homepage/computer_1.png';
import Computer2 from '../../assets/images/homepage/computer_2_1.png';
import Computer3 from '../../assets/images/homepage/computer_3_1.png';
import { analytics } from '../../firebase/FirebaseLibrary';
import { groakTesting } from '../../catalog/Others';

const initialState = {
    videoPopUp: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'showVideo':
            return { ...state, videoPopUp: true };
        case 'hideVideo':
            return { ...state, videoPopUp: false };
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
                        src="https://www.youtube.com/embed/PUB55HKrhqQ"
                        allowFullScreen
                    >
                    </iframe>
                </div>
            </div>
            <div className="firstsection">
                <p ref={top}> </p>
                <div className="animate__animated animate__fadeInLeft animate__faster firstsection-content">
                    <div className="firstsection-topic">
                        <h1>Your Free Contactless Dining Experience</h1>
                        <h2>Re-Open Your Restaurant!! Simple, Safe &#38; 100% Touch Free!</h2>
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
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img className="animate__animated animate__zoomIn animate__faster" src={Computer1} alt="Groak - Computer demo 2" />
                <div className="animate__animated animate__fadeInRight animate__faster text">
                    <p className="sections-topic">Customizable QR Menu Page</p>
                    <p className="sections-subtopic">Create a customizable QR menu that customers can explore. Customize and update your menu anytime from any device</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter left">
                <div className="animate__animated animate__fadeInLeft animate__faster text">
                    <p className="sections-topic">Digital Menus</p>
                    <p className="sections-subtopic">Connect your customers directly to your digital menu so they can view, order, and check-out on their own device</p>
                </div>
                <img className="animate__animated animate__zoomIn animate__faster" src={Phone3} alt="Groak - Computer demo 2" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img className="animate__animated animate__zoomIn animate__faster" src={Computer2} alt="Groak - Computer demo 2" />
                <div className="animate__animated animate__fadeInRight animate__faster text">
                    <p className="sections-topic">Customize your menu. Anytime, Anywhere, Anyplace!</p>
                    <p className="sections-subtopic">Create a contactless digital menu that customers can explore. Update it anytime from your device, with immediate display of your updates to customers!</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter right">
                <div className="animate__animated animate__fadeInLeft animate__faster text">
                    <p className="sections-topic">Chat with customers on each table</p>
                    <p className="sections-subtopic">Promote Safety and Wellbeing for your Customers! Interact with your customers at each table with our live chat feature to minimize health and safety risks</p>
                </div>
                <img className="animate__animated animate__zoomIn animate__faster" src={Computer3} alt="Groak - Computer demo 3" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img className="animate__animated animate__zoomIn animate__faster" src={Computer2} alt="Groak - Computer demo 3" />
                <div className="animate__animated animate__fadeInRight animate__faster text">
                    <p className="sections-topic">Best in class table-management!</p>
                    <p className="sections-subtopic">View real time order updates from each table using the device of your choice. Orders are automatically added and available in our webportal. This feature gives you a clear view into your customer’s recent orders, table occupancy, and order payment alerts</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter left">
                <div className="animate__animated animate__fadeInLeft animate__faster text">
                    <p className="sections-topic">Automatic receipt generation!</p>
                    <p className="sections-subtopic">Automated receipt generation, sent directly to your customer&#39;s phone</p>
                </div>
                <img className="animate__animated animate__zoomIn animate__faster" src={Phone2} alt="Groak - Phone demo 2" />
            </div>
        </div>
    );
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(HomePage));
