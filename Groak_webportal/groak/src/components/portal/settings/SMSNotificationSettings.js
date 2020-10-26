/**
 * This class is part of the settings page that shows sms notification information
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Select, FormControl, MenuItem, Switch, Fab } from '@material-ui/core';
import { Add, CloseRounded } from '@material-ui/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/high-res.css';
import { v4 as uuidv4 } from 'uuid';
import { TextFieldLabelStyles, textFieldLabelPropsShrink } from '../../../catalog/Others';
import { getTimeIn24, getFirstDateMidnight, getFirstDateElevenFiftyNine } from '../../../catalog/TimesDates';
import { addTimeForSMSNotifications } from '../../../catalog/Comments';

const SMSNotificationSettings = (props) => {
    const { classes, smsNotificationRestaurant, setState } = props;

    return (
        <div className="restaurant-settings-sms">
            <p>Allow SMS Notifications:</p>
            <FormControl fullWidth disabled={!smsNotificationRestaurant.groak}>
                <Select
                    fullWidth
                    value={smsNotificationRestaurant.restaurant}
                    onChange={(event) => {
                        setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, restaurant: event.target.value } });
                    }}
                    label="Allow SMS Notifications"
                    variant="outlined"
                >
                    <MenuItem value>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                </Select>
            </FormControl>
            {smsNotificationRestaurant.restaurant && smsNotificationRestaurant.groak ? (
                <>
                    {smsNotificationRestaurant.phones.map((phoneObject, index) => {
                        return (
                            <div key={phoneObject.id}>
                                <div className="restaurant-settings-sms-phone">
                                    <PhoneInput
                                        containerClass="phone"
                                        inputClass="phone"
                                        country="us"
                                        value={phoneObject.phone}
                                        onChange={(phone) => {
                                            const updatedPhones = [...smsNotificationRestaurant.phones];
                                            updatedPhones.splice(index, 1, { ...phoneObject, phone: `+${phone}` });
                                            setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                        }}
                                        type="number"
                                    />
                                    <Fab
                                        className="remove"
                                        size="small"
                                        onClick={() => {
                                            const updatedPhones = [...smsNotificationRestaurant.phones];
                                            updatedPhones.splice(index, 1);
                                            setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                        }}
                                    >
                                        <CloseRounded />
                                    </Fab>
                                </div>
                                {phoneObject.cases.map((caseLocal, index1) => {
                                    return (
                                        <div key={caseLocal.id} className="restaurant-settings-sms-case">
                                            <p style={{ fontSize: '15px' }}>{caseLocal.title}</p>
                                            <Switch
                                                checked={caseLocal.allowed}
                                                size="medium"
                                                onChange={(event) => {
                                                    const updatedCases = [...phoneObject.cases];
                                                    updatedCases.splice(index1, 1, { ...caseLocal, allowed: event.target.checked });
                                                    const updatedPhones = [...smsNotificationRestaurant.phones];
                                                    updatedPhones.splice(index, 1, { ...phoneObject, cases: updatedCases });
                                                    setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                                }}
                                                name="edit"
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                                color="primary"
                                            />
                                        </div>
                                    );
                                })}
                                {phoneObject.days.map((dayLocal, index1) => {
                                    return (
                                        <div key={dayLocal.id} className="restaurant-settings-sms-days">
                                            <div className="restaurant-settings-sms-day">
                                                <Select
                                                    style={{ marginLeft: 10, width: 150 }}
                                                    value={dayLocal.day}
                                                    onChange={(event) => {
                                                        const updatedDays = [...phoneObject.days];
                                                        updatedDays.splice(index1, 1, { ...dayLocal, day: event.target.value });
                                                        const updatedPhones = [...smsNotificationRestaurant.phones];
                                                        updatedPhones.splice(index, 1, { ...phoneObject, days: updatedDays });
                                                        setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                                    }}
                                                    label="Allow SMS Notifications"
                                                    variant="outlined"
                                                >
                                                    <MenuItem value="monday">Monday</MenuItem>
                                                    <MenuItem value="tuesday">Tuesday</MenuItem>
                                                    <MenuItem value="wednesday">Wednesday</MenuItem>
                                                    <MenuItem value="thursday">Thursday</MenuItem>
                                                    <MenuItem value="friday">Friday</MenuItem>
                                                    <MenuItem value="saturday">Saturday</MenuItem>
                                                    <MenuItem value="sunday">Sunday</MenuItem>
                                                </Select>
                                                <Fab
                                                    style={{ marginLeft: 10 }}
                                                    className="remove"
                                                    size="small"
                                                    onClick={() => {
                                                        const updatedDays = [...phoneObject.days];
                                                        updatedDays.splice(index1, 1);
                                                        const updatedPhones = [...smsNotificationRestaurant.phones];
                                                        updatedPhones.splice(index, 1, { ...phoneObject, days: updatedDays });
                                                        setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                                    }}
                                                >
                                                    <CloseRounded />
                                                </Fab>
                                            </div>
                                            <div key={dayLocal.day} className="restaurant-settings-sms-times">
                                                <TextField
                                                    style={{ marginLeft: 10 }}
                                                    label="Start Time"
                                                    type="time"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={getTimeIn24(dayLocal.startTime)}
                                                    onChange={(event) => {
                                                        const hourString = parseFloat(event.target.value.substring(0, 2));
                                                        const minuteString = parseFloat(event.target.value.substring(3));
                                                        const date = new Date();
                                                        date.setHours(hourString);
                                                        date.setMinutes(minuteString);
                                                        date.setSeconds(0);

                                                        const updatedDays = [...phoneObject.days];
                                                        updatedDays.splice(index1, 1, { ...dayLocal, startTime: date });
                                                        const updatedPhones = [...smsNotificationRestaurant.phones];
                                                        updatedPhones.splice(index, 1, { ...phoneObject, days: updatedDays });
                                                        setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                                    }}
                                                    InputLabelProps={textFieldLabelPropsShrink(classes)}
                                                    inputProps={{ step: 300 }}
                                                />
                                                <TextField
                                                    style={{ marginLeft: 10 }}
                                                    label="End Time"
                                                    type="time"
                                                    variant="outlined"
                                                    margin="normal"
                                                    value={getTimeIn24(dayLocal.endTime)}
                                                    onChange={(event) => {
                                                        const hourString = parseFloat(event.target.value.substring(0, 2));
                                                        const minuteString = parseFloat(event.target.value.substring(3));
                                                        const date = new Date();
                                                        date.setHours(hourString);
                                                        date.setMinutes(minuteString);
                                                        date.setSeconds(0);

                                                        const updatedDays = [...phoneObject.days];
                                                        updatedDays.splice(index1, 1, { ...dayLocal, endTime: date });
                                                        const updatedPhones = [...smsNotificationRestaurant.phones];
                                                        updatedPhones.splice(index, 1, { ...phoneObject, days: updatedDays });
                                                        setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                                    }}
                                                    InputLabelProps={textFieldLabelPropsShrink(classes)}
                                                    inputProps={{ step: 300 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="restaurant-settings-sms-add-day">
                                    <Fab
                                        style={{ marginRight: 20 }}
                                        className="add"
                                        size="small"
                                        onClick={() => {
                                            const updatedDays = [...phoneObject.days, {
                                                id: uuidv4(),
                                                day: 'monday',
                                                startTime: getFirstDateMidnight(),
                                                endTime: getFirstDateElevenFiftyNine(),
                                            }];
                                            const updatedPhones = [...smsNotificationRestaurant.phones];
                                            updatedPhones.splice(index, 1, { ...phoneObject, days: updatedDays });
                                            setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                                        }}
                                    >
                                        <Add />
                                    </Fab>
                                    <p style={{ backgroundColor: 'white', fontSize: '12px', width: '80%' }}>{addTimeForSMSNotifications}</p>
                                </div>
                            </div>
                        );
                    })}
                    <Fab
                        className="add"
                        onClick={() => {
                            const updatedPhones = [...smsNotificationRestaurant.phones, { id: uuidv4(),
                                phone: '',
                                cases: [
                                    {
                                        title: 'Upon server requested',
                                        id: 'waiter_called',
                                        allowed: false,
                                    },
                                    {
                                        title: 'Upon customers seating',
                                        id: 'customers_seated',
                                        allowed: false,
                                    },
                                    {
                                        title: 'Upon order placed',
                                        id: 'order_placed',
                                        allowed: false,
                                    },
                                    {
                                        title: 'Upon request received',
                                        id: 'request_received',
                                        allowed: false,
                                    },
                                    {
                                        title: 'Upon payment',
                                        id: 'payment_asked',
                                        allowed: false,
                                    },
                                ],
                                days: [
                                ],
                            }];
                            setState({ type: 'setSMSNotificationRestaurant', smsNotificationRestaurant: { ...smsNotificationRestaurant, phones: updatedPhones } });
                        }}
                    >
                        <Add />
                    </Fab>
                </>
            ) : null}
        </div>
    );
};

SMSNotificationSettings.propTypes = {
    classes: PropTypes.object.isRequired,
    smsNotificationRestaurant: PropTypes.object,
    setState: PropTypes.func.isRequired,
};

SMSNotificationSettings.defaultProps = {
    smsNotificationRestaurant: { restaurant: false,
        groak: true,
        phones: [],
    },
};

export default React.memo(withStyles(TextFieldLabelStyles)(SMSNotificationSettings));
