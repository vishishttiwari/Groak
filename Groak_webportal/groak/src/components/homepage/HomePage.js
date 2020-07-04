/**
 * This page is used for the homescreen.
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './css/HomePage.css';
import { Button } from '@material-ui/core';
import { context } from '../../globalState/globalState';
import AppleDownload from '../../assets/images/homepage/apple_download.png';
import Phone1 from '../../assets/images/homepage/phone_1.png';
import Phone2 from '../../assets/images/homepage/phone_2.png';
import Phone3 from '../../assets/images/homepage/phone_3_2.png';
import Computer1 from '../../assets/images/homepage/computer_4_2.png';
import Computer2 from '../../assets/images/homepage/computer_5_1.png';
import Computer3 from '../../assets/images/homepage/computer_3_1.png';

const HomePage = (props) => {
    const { history } = props;
    const { globalState } = useContext(context);

    return (
        <div className="homepage">
            <div className="firstSection">
                <img src={Phone1} alt="Groak - Phone demo 1" />
                <div className="text verticallyCenter">
                    <div className="iFrame-wrapper">
                        <iframe title="Gro ak_Video" src="https://www.youtube.com/embed/J4VUeuBOu8g" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                    </div>
                    <h1>
                        Your Free Contactless Dining Experience to Re-Open Your Restaurant!! Simple, Safe &#38; 100% Touch Free!
                    </h1>
                    <div className="buttons">
                        <Button
                            className="button"
                            type="button"
                        >
                            <a style={{ textDecoration: 'none', color: 'white' }} href="mailto:contact@groakapp.com">Contact</a>
                        </Button>
                        {globalState.user == null || !globalState.user
                            ? (
                                <Button
                                    className="button"
                                    onClick={() => { history.push('/signup'); }}
                                    type="button"
                                >
                                    Sign Up
                                </Button>
                            ) : (
                                <Button
                                    className="button"
                                    onClick={() => { history.push('/orders'); }}
                                    type="button"
                                >
                                    Orders
                                </Button>
                            ) }
                    </div>
                    <div className="iosDownload">
                        <a href="https://apps.apple.com/in/app/groak-app/id1513988662">
                            <img className="download" src={AppleDownload} alt="Groak - iOS download" />
                        </a>
                    </div>
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
                <img src={Computer1} alt="Groak - Computer demo 3" />
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
            <div className="lastSection verticallyCenter">
                <div className="lastSectionContent">
                    <div className="iosDownload">
                        <a href="https://apps.apple.com/in/app/groak-app/id1513988662">
                            <img className="download" src={AppleDownload} alt="Groak - iOS download" />
                        </a>
                    </div>
                    <div className="contactTitlePrivacy">
                        <div className="contactTitle">
                            Contact Us
                        </div>
                        <div className="contactDetails">
                            <a href="mailto:contact@groakapp.com">contact@groakapp.com</a>
                            <br />
                            <a href="tel:6072792474">(317)-748-0245</a>
                            <br />
                        </div>
                        <div className="privacyPolicy">
                            <button
                                type="button"
                                onClick={() => { history.push('/privacypolicy'); }}
                            >
                                Privacy Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

HomePage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(HomePage));
