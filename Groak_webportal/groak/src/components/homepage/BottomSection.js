/**
 * This page is used for the bottom section in different screens.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import './css/HomePage.css';
import AppleDownload from '../../assets/images/homepage/apple_download_black.png';

const BottomSection = (props) => {
    const { history } = props;

    return (
        <footer className="lastHomepageSection verticallyCenter">
            <div className="lastSectionContent">
                <div className="iosDownload">
                    <a href="https://apps.apple.com/in/app/groak-app/id1513988662">
                        <img className="download" src={AppleDownload} alt="Groak - iOS download" />
                    </a>
                </div>
                <div className="other-content">
                    <div className="sub-content">
                        <button onClick={() => { history.push('/contactus'); }} type="button" className="topic">Contact Us</button>
                        <button onClick={() => { history.push('/requestademo'); }} type="button" className="subtopic">Request A Demo</button>
                        <a href="mailto:contact@groakapp.com">
                            <button type="button" className="subtopic">
                                contact@groakapp.com
                            </button>
                        </a>
                        <a href="tel:3177480254">
                            <button type="button" className="subtopic">
                                (317)-748-0245
                            </button>
                        </a>
                    </div>
                    <div className="sub-content">
                        <button onClick={() => { history.push('/'); }} type="button" className="topic">Company</button>
                        <button onClick={() => { history.push('/'); }} type="button" className="subtopic">About</button>
                        <button onClick={() => { history.push('/privacypolicy'); }} type="button" className="subtopic">Privacy Policy</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

BottomSection.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(React.memo(BottomSection));
