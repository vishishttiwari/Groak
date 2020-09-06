import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const SearchHeader = (props) => {
    const { history, restaurantName, state, setState } = props;

    return (
        <div className="header">
            <KeyboardBackspaceIcon
                className="header-left-icon"
                onClick={() => { history.goBack(); }}
            />
            <div className="header-content">
                <p className="header-title">{restaurantName}</p>
                <TextField
                    className="header-subtitle-custom"
                    id="standard-basic"
                    placeholder="Search"
                    value={state.searchField}
                    onChange={(event) => { setState({ type: 'setSearchField', searchField: event.target.value }); }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
        </div>
    );
};

SearchHeader.propTypes = {
    history: PropTypes.object.isRequired,
    restaurantName: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(SearchHeader));
