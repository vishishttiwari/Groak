/**
 * Thiese functions are used for converting date and time into format that can be shown onto UI
 */

/**
 * This function gets the current date and time
 */
export const getCurrentDateTime = () => {
    const myDate = new Date();
    myDate.setSeconds(0);
    myDate.setMilliseconds(0);
    return myDate;
};

/**
 * This function returns the date with some minutes added to it
 *
 * @param {*} minutes this is the amount of minutes that is added
 */
export const getCurrentDateTimePlusMinutes = (minutes) => {
    const myDate = new Date();
    myDate.setSeconds(0);
    myDate.setMilliseconds(0);
    myDate.setMinutes(myDate.getMinutes() + parseFloat(minutes));
    return myDate;
};

/**
 * This gets the date from the timestamp which is in seconds. The time from the backend is provided in this format
 * and this function converts it into a date that this project can understand.
 *
 * @param {*} timeStamp time receoved from the backend mostly in seconds
 */
export const getDateTimeFromTimeStamp = (timeStamp) => {
    return new Date(timeStamp.seconds * 1000);
};

export const differenceInMinutesFromNow = (timeStamp) => {
    return parseFloat(((getDateTimeFromTimeStamp(timeStamp) - getCurrentDateTime()) / 60000).toFixed(0));
};

export const getTimeIn24 = (date) => {
    return `${date.getHours()}:${date.getMinutes()}`;
};

/**
 * This function returns the date in terms of am and pm
 *
 * @param {*} date date that needs to be converted
 */
export const getTimeInAMPM = (date) => {
    let hour = date.getHours();
    const minute = date.getMinutes();
    const PM = hour > 11;
    hour -= hour > 12 ? 12 : 0;
    return `${hour < 10 ? '0' : ''}${hour.toString()}:${minute < 10 ? '0' : ''}${minute.toString()} ${PM ? 'PM' : 'AM'}`;
};

/**
 * This function converts minutes into AM/PM time format
 *
 * @param {*} minutes to be converted
 */
export const getTimeInAMPMFromMinutesComplete = (minutes) => {
    let hour = (minutes / 60).toFixed(0);
    const minute = (minutes % 60).toFixed(0);
    const PM = hour > 11;
    hour -= hour > 12 ? 12 : 0;
    return `${hour < 10 ? '0' : ''}${hour.toString()}:${minute < 10 ? '0' : ''}${minute.toString()} ${PM ? 'PM' : 'AM'}`;
};

/**
 * This function converts minutes into 24 hour time format
 *
 * @param {*} minutes to be converted
 */
export const getTimeIn24FromMinutes = (minutes) => {
    const hour = (minutes / 60).toFixed(0);
    const minute = (minutes % 60).toFixed(0);
    return `${hour < 10 ? '0' : ''}${hour.toString()}:${minute < 10 ? '0' : ''}${minute.toString()}`;
};

/**
     * This function is used for getting time in AM and PM from time stamp
     *
     * @param {*} orderServeTime serve time in timestamp
     */
export const getTimeInAMPMFromTimeStamp = (timeStamp) => {
    return getTimeInAMPM(getDateTimeFromTimeStamp(timeStamp));
};
