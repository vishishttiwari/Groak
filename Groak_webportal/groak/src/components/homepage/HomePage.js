/**
 * This page is used for the homescreen.
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './css/HomePage.css';
import { Button } from '@material-ui/core';
import { context } from '../../globalState/globalState';
import Phone1 from '../../assets/images/homepage/phone_1.png';
import Phone2 from '../../assets/images/homepage/phone_2.png';
import Computer1 from '../../assets/images/homepage/computer_4_1.png';
import Computer2 from '../../assets/images/homepage/computer_5_2.png';
import Computer3 from '../../assets/images/homepage/computer_3_2.png';

const HomePage = (props) => {
    const { history } = props;
    const { globalState } = useContext(context);

    return (
        <div className="homepage">
            <div className="whiteBackground sections">
                <img src={Phone1} alt="Groak - Phone demo 1" />
                <div className="text verticallyCenter">
                    <h1>
                        Enable your dine-in customers to explore an interactive menu and order through their phones!
                    </h1>
                    <div className="buttons">
                        <Button
                            className="button"
                            type="button"
                        >
                            <a style={{ textDecoration: 'none', color: 'white' }} href="mailto:contact@groakapp.com">Contact Us</a>
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
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter">
                <div className="text">
                    <p>View real time order updates from each table using the device of your choice</p>
                </div>
                <img src={Computer1} alt="Groak - Computer demo 2" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Computer3} alt="Groak - Computer demo 2" />
                <div className="text">
                    <p>Interact with your customers at each table through chat messages to provide a personal touch</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter">
                <div className="text">
                    <p>Create a detailed menu that customers love to explore and update it anytime from your device, with immediate display of updates</p>
                </div>
                <img src={Computer2} alt="Groak - Computer demo 3" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Phone2} alt="Groak - Phone demo 2" />
                <div className="text">
                    <p>Automated receipt generation, sent directly to your customer&#39;s phone</p>
                </div>
            </div>
            <div className="primaryColorBackground lastSection verticallyCenter">
                <div>
                    <div className="contactTitle">
                        Contact Us
                    </div>
                    <div>
                        <a href="mailto:contact@groakapp.com">contact@groakapp.com</a>
                        <br />
                        <a href="tel:6072792474">(607)-279-2474</a>
                        <br />
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
