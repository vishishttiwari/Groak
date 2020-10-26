/**
 * This class is part of the settings page that shows the restaurant information
 */
import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import * as moment from 'moment-timezone';

import { TextField, Select, OutlinedInput, MenuItem, Button, IconButton, Checkbox, ListItemText, Chip, FormControl, Fab } from '@material-ui/core';
import { Add, CloseRounded, CloudUpload } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { context } from '../../../globalState/globalState';

import './css/Settings.css';
import { DemoRestaurantCovidGuidelines, DemoRestaurantCovidMessage } from '../../../catalog/Demo';
import { addMissingCategories, addMissingDishes, addMissingQRCodes, updateRestaurantAPI } from './SettingsAPICalls';
import { cuisines, TextFieldLabelStyles, textFieldLabelProps, uploadButtonStyle, frontDoorQRMenuPageId, getImageLink, viewOnlyQRMenuPageId, groakTesting } from '../../../catalog/Others';
import CSSVariables from '../../../globalCSS/_globalCSS.scss';
import { InvalidRestaurantName, InvalidPhoneNumber } from '../../../catalog/NotificationsComments';
import { FrontDoorQRMenuPage, ViewOnlyQRMenuPage } from '../../../catalog/Comments';
import Payments from './Payment';
import Tips from './Tips';
import SMSNotificationSettings from './SMSNotificationSettings';

const RestaurantSettings = (props) => {
    const { history, classes, state, setState } = props;
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
     * This function is used for adding image
     *
     * @param {*} event this is received from the input button
     */
    const addImage = (event) => {
        setState({ type: 'setImage', image: { file: event.target.files[0], link: URL.createObjectURL(event.target.files[0]) } });
    };

    /**
     * This function is used for removing image
     */
    const removeImage = () => {
        setState({ type: 'setImage', image: { file: null, link: '' } });
    };

    /**
     * This function is used for saving restaurant information
     *
     * @param {*} event this is received from the submit button
     */
    const frontDoorQRPage = async (event) => {
        event.preventDefault();
        history.push({
            pathname: `/qrmenupage/${frontDoorQRMenuPageId}`,
        });
    };

    /**
     * This function is used for saving restaurant information
     *
     * @param {*} event this is received from the submit button
     */
    const viewOnlyQRPage = async (event) => {
        event.preventDefault();
        history.push({
            pathname: `/qrmenupage/${viewOnlyQRMenuPageId}`,
        });
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
        if (state.restaurant.smsNotificationRestaurant) {
            let phoneValid = true;
            state.restaurant.smsNotificationRestaurant.phones.forEach((phoneObject) => {
                if (phoneObject.phone.length < 6 || phoneObject.phone.charAt(0) !== '+') {
                    phoneValid = false;
                }
            });

            if (!phoneValid) {
                enqueueSnackbar(InvalidPhoneNumber, { variant: 'error' });
                return;
            }
        }

        await updateRestaurantAPI(globalState.restaurantIdPortal, state.restaurant, state.logo, state.image, setState, setGlobalState, enqueueSnackbar);
    };

    const missingDishes = async (event) => {
        event.preventDefault();
        await addMissingDishes(globalState.restaurantIdPortal, setState, setGlobalState, enqueueSnackbar);
    };

    const missingCategories = async (event) => {
        event.preventDefault();
        await addMissingCategories(globalState.restaurantIdPortal, setState, setGlobalState, enqueueSnackbar);
    };

    const missingQRCodes = async (event) => {
        event.preventDefault();
        await addMissingQRCodes(globalState.restaurantIdPortal, setState, setGlobalState, enqueueSnackbar);
    };

    return (
        <div className="restaurant-settings">
            <h2>Restaurant Information</h2>
            <h3>Restaurant Info</h3>
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
                renderValue={(selected) => {
                    return (
                        <div className={classes.chips}>
                            {selected.map((value) => {
                                return (
                                    <Chip key={value} label={value} className={classes.chip} />
                                );
                            })}
                        </div>
                    );
                }}
                input={<OutlinedInput />}
            >
                {cuisines.map((cuisine) => {
                    return (
                        <MenuItem key={cuisine} value={cuisine}>
                            <Checkbox style={{ color: CSSVariables.primaryColor }} checked={state.restaurant && state.restaurant.type ? state.restaurant.type.indexOf(cuisine) > -1 : false} />
                            <ListItemText primary={cuisine} />
                        </MenuItem>
                    );
                })}
            </Select>
            <p>Time zone:</p>
            <Select
                value={state.restaurant.timezone ? state.restaurant.timezone : 'America/Los_Angeles'}
                onChange={(event) => { setState({ type: 'setTimezone', timezone: event.target.value }); }}
                label="Time zone"
                variant="outlined"
            >
                {moment.tz.names().map((timezone) => {
                    return (
                        <MenuItem key={timezone} value={timezone}>{timezone}</MenuItem>
                    );
                })}
            </Select>
            <div className="horizontal-line"></div>
            <h3>Payments</h3>
            <p>Payment Methods:</p>
            <TextField
                label="Venmo:"
                type="text"
                value={state.restaurant && state.restaurant.paymentMethods && state.restaurant.paymentMethods.venmo ? state.restaurant.paymentMethods.venmo : ''}
                margin="normal"
                fullWidth
                variant="outlined"
                onChange={(event) => { setState({ type: 'setVenmo', venmo: event.target.value }); }}
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <p>Payments:</p>
            {state.restaurant.payments.map((payment, index) => {
                return (
                    payment.id !== 'tips' ? (
                        <Payments
                            key={payment.id}
                            index={index}
                            title={payment.title}
                            percentage={payment.percentage}
                            value={payment.value}
                            setState={setState}
                        />
                    ) : (
                        <Tips
                            key={payment.id}
                            value0={payment.values[0]}
                            value1={payment.values[1]}
                            value2={payment.values[2]}
                            setState={setState}
                        />
                    )
                );
            })}
            <Fab
                className="add"
                size="small"
                onClick={() => { setState({ type: 'addPayment' }); }}
            >
                <Add />
            </Fab>
            <div className="horizontal-line"></div>
            <h3>Covid</h3>
            <TextField
                label="Covid Message for Customers:"
                multiline
                placeholder={`Ex: ${DemoRestaurantCovidMessage}`}
                rows="5"
                type="text"
                value={state.restaurant ? state.restaurant.covidMessage : ''}
                margin="normal"
                fullWidth
                variant="outlined"
                onChange={(event) => { setState({ type: 'setCovidMessage', covidMessage: event.target.value }); }}
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <TextField
                label="Covid Directives in your area:"
                multiline
                placeholder={`Ex: ${DemoRestaurantCovidGuidelines}`}
                rows="5"
                type="text"
                value={state.restaurant ? state.restaurant.covidGuidelines : ''}
                margin="normal"
                fullWidth
                variant="outlined"
                onChange={(event) => { setState({ type: 'setCovidGuidelines', covidGuidelines: event.target.value }); }}
                InputLabelProps={textFieldLabelProps(classes)}
            />
            <div className="horizontal-line"></div>
            <h3>Additions</h3>
            <p>Allow Ordering:</p>
            <FormControl disabled={!state.restaurant.allowOrdering.groak}>
                <Select
                    value={state.restaurant.allowOrdering.restaurant}
                    onChange={(event) => { setState({ type: 'setAllowOrdering', allowOrdering: event.target.value }); }}
                    label="Allow Ordering"
                    variant="outlined"
                >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>
            <p>Allow Rating:</p>
            <FormControl disabled={state.restaurant.allowRating ? !state.restaurant.allowRating.groak : false}>
                <Select
                    value={state.restaurant.allowRating ? state.restaurant.allowRating.restaurant : false}
                    onChange={(event) => { setState({ type: 'setAllowRating', allowRating: event.target.value }); }}
                    label="Allow Rating"
                    variant="outlined"
                >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>
            <p>Allow Calling Server:</p>
            <FormControl disabled={state.restaurant.allowWaiter ? !state.restaurant.allowWaiter.groak : false}>
                <Select
                    value={state.restaurant.allowWaiter ? state.restaurant.allowWaiter.restaurant : false}
                    onChange={(event) => { setState({ type: 'setAllowWaiter', allowWaiter: event.target.value }); }}
                    label="Allow Rating"
                    variant="outlined"
                >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>
            <SMSNotificationSettings smsNotificationRestaurant={state.restaurant.smsNotificationRestaurant} setState={setState} />
            <div className="horizontal-line"></div>
            <h3>QR Menu Pages</h3>
            <p style={{ marginLeft: '40px', fontSize: '15px' }}>
                Front Door QR Menu Page (
                {FrontDoorQRMenuPage}
                ):
            </p>
            <Button
                className="normal-buttons"
                type="submit"
                onClick={frontDoorQRPage}
            >
                Front Door Menu
            </Button>
            <p style={{ marginLeft: '40px', fontSize: '15px' }}>
                View Only QR Menu Page (
                {ViewOnlyQRMenuPage}
                ):
            </p>
            <Button
                className="normal-buttons"
                type="submit"
                onClick={viewOnlyQRPage}
            >
                View Only Menu
            </Button>
            {groakTesting ? (
                <>
                    <div className="horizontal-line"></div>
                    <h3>Diagnostics</h3>
                    <div className="restaurant-settings-diagnotics">
                        <Button
                            className="normal-buttons"
                            style={{ marginRight: '20px' }}
                            type="button"
                            onClick={missingDishes}
                        >
                            Missing Dishes?
                        </Button>
                        <Button
                            className="normal-buttons"
                            style={{ marginRight: '20px' }}
                            type="button"
                            onClick={missingCategories}
                        >
                            Missing Categories?
                        </Button>
                        <Button
                            className="normal-buttons"
                            style={{ marginRight: '20px' }}
                            type="button"
                            onClick={missingQRCodes}
                        >
                            Missing QR Codes?
                        </Button>
                    </div>
                </>
            ) : null}
            <div className="horizontal-line"></div>
            <h3>Images</h3>
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
                    <img src={getImageLink(state.logo.link)} alt={state.restaurant.name || 'Restaurant Logo'} />
                </div>
            ) : null}
            <input
                accept="image/*"
                id="image-button-photo"
                onChange={addImage}
                type="file"
                style={{ display: 'none', width: '200px' }}
            />
            <label className="upload-image-button-label" htmlFor="image-button-photo">
                <Button
                    className="normal-buttons"
                    variant="contained"
                    component="span"
                >
                    Upload Image
                    <CloudUpload className={uploadButtonStyle().rightIcon} />
                </Button>
            </label>
            {state.image && state.image.link ? (
                <div className="image-container">
                    <IconButton onClick={removeImage}>
                        <CloseRounded />
                    </IconButton>
                    <img src={getImageLink(state.image.link)} alt={state.restaurant.name || 'Restaurant Image'} />
                </div>
            ) : null}
            <div className="horizontal-line"></div>
            <Button
                className="success-buttons"
                type="submit"
                style={{ width: '80%', height: '50px' }}
                onClick={saveChanges}
            >
                Save Changes
            </Button>
            <div className="horizontal-line"></div>
        </div>
    );
};

RestaurantSettings.propTypes = {
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default withRouter(React.memo(withStyles(TextFieldLabelStyles)(RestaurantSettings)));
