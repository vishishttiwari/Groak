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
import Computer1 from '../../assets/images/homepage/computer_1_2.png';
import Computer2 from '../../assets/images/homepage/computer_2_1.png';
import Computer3 from '../../assets/images/homepage/computer_3_2.png';

const HomePage = (props) => {
    const { history } = props;
    const { globalState } = useContext(context);

    return (
        <div className="homepage">
            <div className="whiteBackground sections">
                <img src={Phone1} alt="Groak - Phone demo 1" />
                <div className="text verticallyCenter">
                    <p>
                        Help your in-house customers order food through app and reduce your dependence on
                        <i> waiters!</i>
                    </p>
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
                    <p>Organize your tables and orders on a computer or a tablet</p>
                </div>
                <img src={Computer1} alt="Groak - Computer demo 2" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Computer3} alt="Groak - Computer demo 2" />
                <div className="text">
                    <p>Not only get orders but also chat with customers at each table</p>
                </div>
            </div>
            <div className="primaryColorBackground sections verticallyCenter">
                <div className="text">
                    <p>Set up your menu in a never before fashion and change the availability and details of any dish in real time</p>
                </div>
                <img src={Computer2} alt="Groak - Computer demo 3" />
            </div>
            <div className="whiteBackground sections verticallyCenter">
                <img src={Phone2} alt="Groak - Phone demo 2" />
                <div className="text">
                    <p>Customers receive receipt directly through their app</p>
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
