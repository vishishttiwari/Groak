/**
 * Thiese functions are used for converting date and time into format that can be shown onto UI
 */

/**
  * 10 mins
  */
export const timeoutValueForCustomer = 10 * 1000 * 60;

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
 * This function gets the current date and time in string in beautiful format
 */
export const getCurrentDateTimeInStringFormat = () => {
    const myDate = new Date();
    const month = [];
    month[0] = 'Jan';
    month[1] = 'Feb';
    month[2] = 'Mar';
    month[3] = 'Apr';
    month[4] = 'May';
    month[5] = 'Jun';
    month[6] = 'Jul';
    month[7] = 'Aug';
    month[8] = 'Sep';
    month[9] = 'Oct';
    month[10] = 'Nov';
    month[11] = 'Dec';
    return `${myDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} ${month[myDate.getMonth()]} ${myDate.getDate()}, ${myDate.getFullYear()}`;
};

/**
 * This function gets the current day
 */
export const getDay = () => {
    const d = new Date();
    const weekday = new Array(7);
    weekday[0] = 'sunday';
    weekday[1] = 'monday';
    weekday[2] = 'tuesday';
    weekday[3] = 'wednesday';
    weekday[4] = 'thursday';
    weekday[5] = 'friday';
    weekday[6] = 'saturday';

    return weekday[d.getDay()];
};

/**
 * This function gets minutes from midnight
 */
export const getMinutesFromMidnight = () => {
    const now = new Date();
    const then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0,
    );
    return Math.floor((now.getTime() - then.getTime()) / (1000 * 60)); // difference in milliseconds
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
    let hour = Math.floor(minutes / 60).toFixed(0);
    const minute = (minutes % 60).toFixed(0);
    const PM = hour > 11;
    if (parseFloat(hour) === 0) {
        hour = 12;
    } else { hour -= hour > 12 ? 12 : 0; }
    return `${hour < 10 ? '0' : ''}${hour.toString()}:${minute < 10 ? '0' : ''}${minute.toString()} ${PM ? 'PM' : 'AM'}`;
};

/**
 * This function converts minutes into 24 hour time format
 *
 * @param {*} minutes to be converted
 */
export const getTimeIn24FromMinutes = (minutes) => {
    const hour = Math.floor(minutes / 60).toFixed(0);
    const minute = (minutes % 60).toFixed(0);
    return `${hour < 10 ? '0' : ''}${hour.toString()}:${minute < 10 ? '0' : ''}${minute.toString()}`;
};

/**
 * This function is used for getting time in AM and PM from time stamp
 *
 * @param {*} timeStamp serve time in timestamp
 */
export const getTimeInAMPMFromTimeStamp = (timeStamp) => {
    return getTimeInAMPM(getDateTimeFromTimeStamp(timeStamp));
};
