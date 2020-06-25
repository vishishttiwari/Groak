/**
 * This class is part of the settings page that shows the restaurant information
 */
import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { TextField, Select, OutlinedInput, MenuItem, Button, IconButton } from '@material-ui/core';
import { CloseRounded, CloudUpload } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { context } from '../../../globalState/globalState';

import './css/Settings.css';
import { DemoRestaurantCovidMessage } from '../../../catalog/Demo';
import { updateRestaurantAPI } from './SettingsAPICalls';
import { cuisines, TextFieldLabelStyles, textFieldLabelProps, uploadButtonStyle } from '../../../catalog/Others';
import { InvalidRestaurantName } from '../../../catalog/NotificationsComments';

const RestaurantSettings = (props) => {
    const { classes, state, setState } = props;
    const { globalState, setGlobalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function is used for adding logo
     *
     * @param {*} event this is received from the input button
     */
    const addLogo = (event) => {
        setState({ type: 'setLogo', logo: { file: event.target.files[0], link: URL.createObjectURL(event.target.files[0]) } });
    };

    /**
     * This function is used for removing logo
     */
    const removeLogo = () => {
        setState({ type: 'setLogo', logo: { file: null, link: '' } });
    };

    /**
     * This function is used for saving restaurant information
     *
     * @param {*} event this is received from the submit button
     */
    const saveChanges = async (event) => {
        event.preventDefault();
        if (state.restaurant.name.length === 0) {
            enqueueSnackbar(InvalidRestaurantName, { variant: 'error' });
            return;
        }
        await updateRestaurantAPI(globalState.restaurantId, state.restaurant, state.logo, setState, setGlobalState, enqueueSnackbar);
    };

    return (
        <div className="restaurant-settings">
            <h2>Restaurant Information</h2>
            <TextField
                label="Restaurant Name:"
                type="text"
                value={state.restaurant ? state.restaurant.name : ''}
                margin="normal"
                fullWidth
                variant="outlined"
                required
                onChange={(event) => { setState({ type: 'setName', name: event.target.value }); }}
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <p>Cuisine type:</p>
            <Select
                multiple
                required
                fullWidth
                value={state.restaurant ? state.restaurant.type : []}
                onChange={(event) => { setState({ type: 'setType', cuisineType: event.target.value }); }}
                variant="outlined"
                input={<OutlinedInput />}
            >
                {cuisines.map((cuisine) => {
                    return (<MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>);
                })}
            </Select>
            <TextField
                label="Covid Message for customers:"
                multiline
                placeholder={`Ex: ${DemoRestaurantCovidMessage}`}
                rows="5"
                type="text"
                value={state.restaurant ? state.restaurant.covidMessage : ''}
                margin="normal"
                fullWidth
                variant="outlined"
                required
                onChange={(event) => { setState({ type: 'setCovidMessage', covidMessage: event.target.value }); }}
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <p>Logo:</p>
            <input
                accept="image/*"
                id="icon-button-photo"
                onChange={addLogo}
                type="file"
                style={{ display: 'none', width: '200px' }}
            />
            <label className="upload-image-button-label" htmlFor="icon-button-photo">
                <Button
                    className="normal-buttons"
                    variant="contained"
                    component="span"
                >
                    Upload Logo
                    <CloudUpload className={uploadButtonStyle().rightIcon} />
                </Button>
            </label>
            {state.logo && state.logo.link ? (
                <div className="image-container">
                    <IconButton onClick={removeLogo}>
                        <CloseRounded />
                    </IconButton>
                    <img src={state.logo.link} alt={state.restaurant.name || 'Restaurant Image'} />
                </div>
            ) : null}
            <Button
                className="success-buttons"
                type="submit"
                onClick={saveChanges}
            >
                Save Changes
            </Button>
        </div>
    );
};

RestaurantSettings.propTypes = {
    classes: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(RestaurantSettings)));
