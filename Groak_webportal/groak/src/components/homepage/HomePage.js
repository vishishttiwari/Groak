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
import Groak from '../../assets/images/white_name_icon.png';
import AppleDownload from '../../assets/images/homepage/apple_download_white.png';
import GoogleDownload from '../../assets/images/homepage/google_download.png';
import Phone2 from '../../assets/images/homepage/phone_2.png';
import Phone3 from '../../assets/images/homepage/phone_3.png';
import Computer1 from '../../assets/images/homepage/computer_1.png';
import Computer2 from '../../assets/images/homepage/computer_2.png';
import Computer3 from '../../assets/images/homepage/computer_3.png';
import { analytics } from '../../firebase/FirebaseLibrary';

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
        top.current.scrollIntoViewIfNeeded({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
        });
        analytics.logEvent('visit_website_web_testing');
    }, [top]);

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
                        src="https://www.youtube.com/embed/J4VUeuBOu8g"
                        allowFullScreen
                    >
                    </iframe>
                </div>
            </div>
            <div className="firstSection">
                <p ref={top}> </p>
                <img className="name-icon" src={Groak} alt="Groak" />
                <div className="text">
                    <h1>
                        Your Free Contactless Dining Experience to Re-Open Your Restaurant!! Simple, Safe &#38; 100% Touch Free!
                    </h1>
                    <div className="buttons">
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
                    <div className="apps">
                        <div className="appDownload">
                            <a href="https://apps.apple.com/in/app/groak-app/id1513988662">
                                <img className="download" src={AppleDownload} alt="Download on the App Store" />
                            </a>
                        </div>
                        <div className="appDownload">
                            <a href="https://play.google.com/store/apps/details?id=com.groak.groak&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                                <img className="download" alt="Get it on Google Play" src={GoogleDownload} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Computer1} alt="Groak - Computer demo 2" />
                <div className="text">
                    <p>Create a customizable QR menu that customers can explore. Customize and update your menu anytime from any device</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter">
                <div className="text">
                    <p>Connect your customers directly to your digital menu so they can view, order, and check-out on their own device</p>
                </div>
                <img src={Phone3} alt="Groak - Computer demo 2" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Computer2} alt="Groak - Computer demo 2" />
                <div className="text">
                    <p>Create a contactless digital menu that customers can explore. Update it anytime from your device, with immediate display of your updates to customers!</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter">
                <div className="text">
                    <p>Promote Safety and Wellbeing for your Customers! Interact with your customers at each table with our live chat feature to minimize health and safety risks</p>
                </div>
                <img src={Computer3} alt="Groak - Computer demo 3" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Computer2} alt="Groak - Computer demo 3" />
                <div className="text">
                    <p>View real time order updates from each table using the device of your choice. Orders are automatically added and available in our webportal. This feature gives you a clear view into your customer’s recent orders, table occupancy, and order payment alerts</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter">
                <div className="text">
                    <p>Automated receipt generation, sent directly to your customer&#39;s phone</p>
                </div>
                <img src={Phone2} alt="Groak - Phone demo 2" />
            </div>
        </div>
    );
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(HomePage));
