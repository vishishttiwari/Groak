/**
 * Used for representing footer in requests
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, TextField, CircularProgress } from '@material-ui/core';
import { randomNumber } from '../../../catalog/Others';

const RequestsFooter = (props) => {
    const { requestField, loadingSpinner, setState, sendHandler } = props;

    const suggestions = ['💧',
        '🍴',
        '🍷',
        '\uD83C\uDF7D',
        'Specials?',
        'Suggest gluten free dishes',
        'Suggest food for nut allergies',
    ];
    const fullSuggestions = ['Can we have some water please?',
        'Can we get some cutlery please?',
        'Can we get a refill on our drink?',
        'Can we get some extra plates?',
        'Could you tell me about the specials?',
        'Can you suggest some gluten fee dishes?',
        'Can you suggest some dishes for someoe with nut allergies?',
    ];

    return (
        <div className="footer">
            <div className="footer-suggestions">
                {suggestions.map((suggestion, index) => {
                    return (
                        <div
                            key={randomNumber()}
                            className="footer-suggestion"
                            onClick={() => { setState({ type: 'changeRequestField', requestField: fullSuggestions[index] }); }}
                        >
                            <p>{suggestion}</p>
                        </div>
                    );
                })}
            </div>
            <div className="footer-bottom-section">
                <TextField
                    className="footer-input"
                    id="outlined-basic"
                    value={requestField}
                    onChange={(event) => { setState({ type: 'changeRequestField', requestField: event.target.value }); }}
                    placeholder="Anything we can help you with?"
                    variant="outlined"
                    color="primary"
                    multiline
                    rows={2}
                />
                <div className="footer-bottom-section-others">
                    <Button
                        className="footer-send-button"
                        variant="outlined"
                        color="primary"
                        onClick={sendHandler}
                    >
                        Send
                    </Button>
                    <CircularProgress
                        className="footer-send-spinner"
                        variant="indeterminate"
                        size={20}
                        thickness={2}
                        style={{
                            display: (loadingSpinner ? 'block' : 'none'),
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

RequestsFooter.propTypes = {
    requestField: PropTypes.string.isRequired,
    loadingSpinner: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
    sendHandler: PropTypes.func.isRequired,
};

export default React.memo(RequestsFooter);
