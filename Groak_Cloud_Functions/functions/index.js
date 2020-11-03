const moment = require('moment-timezone');
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

const smsClient = require('twilio')('ACa005fba7324e63f3c3c740ce0a013403', 'cda951c3d151699db6407a9dcb514114');

const TableStatus = {
    available: 'available',
    seated: 'seated',
    ordered: 'ordered',
    approved: 'approved',
    served: 'served',
    payment: 'payment',
};

exports.restaurantOrders = functions.firestore
    .document('restaurants/{restaurantId}/orders/{orderId}')
    .onUpdate((change, context) => {
        const before = change.before.data()
        const after = change.after.data()
		
		const restaurant = db.collection('restaurants').doc(context.params.restaurantId).get()
			.then((querySnapshot) => {
				if (querySnapshot) {
					const registrationTokens = querySnapshot.data().registrationTokens ? querySnapshot.data().registrationTokens : []
					const smsNotificationRestaurant = querySnapshot.data().smsNotificationRestaurant
					const timezone = querySnapshot.data().timezone ? querySnapshot.data().timezone : 'America/Los_Angeles'
					const phoneNumbers = []
					
					if (smsNotificationRestaurant) {
						if (before.status === TableStatus.available && after.status === TableStatus.seated) {
							smsNotificationRestaurant.phones.forEach((phone) => {
								if (phone && phone.phone.length > 6 && phone.phone.charAt(0) === '+' && phone.cases[1].allowed) {
									let dayValid = false;
									phone.days.forEach((day) => {
										if (day.day === getDay(timezone) && compareCurrentTimeToRange(day.startTime, day.endTime, timezone)) {
											dayValid = true;
										}
									})
									if (dayValid) {
										phoneNumbers.push(phone.phone);
									}
								}
							})
							if (smsNotificationRestaurant && smsNotificationRestaurant.groak && smsNotificationRestaurant.restaurant) {
								sendSMS(`Customers seated at ${change.after.data().table}`, phoneNumbers)
							}
						}
						if (after.status === TableStatus.ordered) {
							smsNotificationRestaurant.phones.forEach((phone) => {
								if (phone && phone.phone.length > 6 && phone.phone.charAt(0) === '+' && phone.cases[2].allowed) {
									let dayValid = false;
									phone.days.forEach((day) => {
										if (day.day === getDay(timezone) && compareCurrentTimeToRange(day.startTime, day.endTime, timezone)) {
											dayValid = true;
										}
									})
									if (dayValid) {
										phoneNumbers.push(phone.phone);
									}
								}
							})
							if (smsNotificationRestaurant && smsNotificationRestaurant.groak && smsNotificationRestaurant.restaurant) {
								sendSMS(`Order placed at ${change.after.data().table}`, phoneNumbers)
							}
						}
						if (after.status === TableStatus.payment) {
							smsNotificationRestaurant.phones.forEach((phone) => {
								if (phone && phone.phone.length > 6 && phone.phone.charAt(0) === '+' && phone.cases[4].allowed) {
									let dayValid = false;
									phone.days.forEach((day) => {
										if (day.day === getDay(timezone) && compareCurrentTimeToRange(day.startTime, day.endTime, timezone)) {
											dayValid = true;
										}
									})
									if (dayValid) {
										phoneNumbers.push(phone.phone);
									}
								}
							})
							if (smsNotificationRestaurant && smsNotificationRestaurant.groak && smsNotificationRestaurant.restaurant) {
								sendSMS(`Order placed at ${change.after.data().table}`, phoneNumbers)
							}
						}
						if (before.callWaiter !== undefined && 
								before.callWaiter !== null && 
								after.callWaiter !== undefined && 
								after.callWaiter !== null && 
								before.callWaiterCount !== undefined && 
								before.callWaiterCount !== null && 
								after.callWaiterCount !== undefined && 
								after.callWaiterCount !== null && 
								after.callWaiterCount !== 0 && 
								before.callWaiterCount !== after.callWaiterCount) {

							smsNotificationRestaurant.phones.forEach((phone) => {
								if (phone && phone.phone.length > 6 && phone.phone.charAt(0) === '+' && phone.cases[0].allowed) {
									let dayValid = false;
									phone.days.forEach((day) => {
										if (day.day === getDay(timezone) && compareCurrentTimeToRange(day.startTime, day.endTime, timezone)) {
											dayValid = true;
										}
									})
									if (dayValid) {
										phoneNumbers.push(phone.phone);
									}
								}
							})
							if (smsNotificationRestaurant && smsNotificationRestaurant.groak && smsNotificationRestaurant.restaurant) {
								sendSMS(`Server is being called at ${change.after.data().table}`, phoneNumbers)
							}
						}
					}
					
					if (registrationTokens && change.before.exists) {
						if (before.status === TableStatus.available && after.status === TableStatus.seated) {
							sendNotificationToDevices(`Customers seated at ${change.after.data().table}`, `Customers are now seated at ${change.after.data().table}`, 'order', registrationTokens)
						}
						if (after.status === TableStatus.ordered) {
							sendNotificationToDevices(`Order placed at ${change.after.data().table}`, `Customers have placed order at ${change.after.data().table}`, 'order', registrationTokens)
						}
						if (after.status === TableStatus.payment) {
							sendNotificationToDevices(`Payment at ${change.after.data().table}`, `Customers have asked for payment at ${change.after.data().table}`, 'order', registrationTokens)
						}
						if (before.callWaiter !== undefined && 
								before.callWaiter !== null && 
								after.callWaiter !== undefined && 
								after.callWaiter !== null && 
								before.callWaiterCount !== undefined && 
								before.callWaiterCount !== null && 
								after.callWaiterCount !== undefined && 
								after.callWaiterCount !== null && 
								after.callWaiterCount !== 0 && 
								before.callWaiterCount !== after.callWaiterCount) {
									
							sendNotificationToDevices(`Server called at ${change.after.data().table}`, `Server is being called at ${change.after.data().table}`, 'order', registrationTokens)
						}
					}
				}
				
				return;
		    })
			.catch((error) => {
		        console.log("Error getting documents: ", error);
				throw error;
		    });
		
        return true
    })
	
exports.restaurantRequests = functions.firestore
    .document('restaurants/{restaurantId}/requests/{requestId}')
    .onUpdate((change, context) => {
        const before = change.before.data()
        const after = change.after.data()
        const beforeRequests = before.requests
        const afterRequests = after.requests
		
		const restaurant = db.collection('restaurants').doc(context.params.restaurantId).get()
			.then((querySnapshot) => {
				if (querySnapshot) {
					const registrationTokens = querySnapshot.data().registrationTokens ? querySnapshot.data().registrationTokens : []
					const smsNotificationRestaurant = querySnapshot.data().smsNotificationRestaurant
					const timezone = querySnapshot.data().timezone ? querySnapshot.data().timezone : 'America/Los_Angeles'
					const phoneNumbers = []
					
					if (smsNotificationRestaurant) {
						
						if (beforeRequests.length !== afterRequests.length) {
							if (beforeRequests.length !== afterRequests.length) {
								if (afterRequests[afterRequests.length - 1].createdByUser) {
									smsNotificationRestaurant.phones.forEach((phone) => {
										if (phone && phone.phone.length > 6 && phone.phone.charAt(0) === '+' && phone.cases[3].allowed) {
											let dayValid = false;
											phone.days.forEach((day) => {
												if (day.day === getDay(timezone) && compareCurrentTimeToRange(day.startTime, day.endTime, timezone)) {
													dayValid = true;
												}
											})
											if (dayValid) {
												phoneNumbers.push(phone.phone);
											}
										}
									})
									
									if (smsNotificationRestaurant && smsNotificationRestaurant.groak && smsNotificationRestaurant.restaurant) {
										sendSMS(`New request from customers at ${after.table}. The request is "${afterRequests[afterRequests.length - 1].request}"`, phoneNumbers)
									}
								}
							}
						}
					}
					
					if (registrationTokens && change.before.exists) {
						if (beforeRequests.length !== afterRequests.length) {
							if (afterRequests[afterRequests.length - 1].createdByUser) {
								sendNotificationToDevices(`New request from customers at ${after.table}`, `New request from customers at ${after.table}`, 'request', registrationTokens)
							}
						}
					}
				}
				
				return;
		    })
			.catch((error) => {
		        console.log("Error getting documents: ", error);
				throw error;
		    });
		
        return true
    })
	



exports.orderServeTimeChanged = functions.firestore
    .document('restaurants/{restaurantId}/orders/{orderId}')
    .onUpdate((change, context) => {
        const before = change.before.data()
        const after = change.after.data()
        const newServeTime = after.serveTime
        const registrationTokens = change.after.data().registrationTokensCustomers
		const restaurantName = change.before.data().restaurantName

        if (change.before.exists) {
            if (before.status === TableStatus.ordered && after.status === TableStatus.approved) {
				sendNotificationToDevices(`Order approved by ${restaurantName}`, `Order will be served in ${getDifferenceInMinutes(newServeTime)} minutes`, 'order', registrationTokens)
            }
            if (before.status === TableStatus.approved && after.status === TableStatus.approved && getDifferenceInMinutes(before.serveTime) !== getDifferenceInMinutes(after.serveTime)) {
				sendNotificationToDevices('Serve time updated', `Your serve time has been updated. Your order will now be served in ${getDifferenceInMinutes(newServeTime)} minutes`, 'order', registrationTokens)
            }
			if (before.status !== TableStatus.available && after.status === TableStatus.available) {
				sendNotificationToDevices(`Thank you for visiting ${restaurantName}`, `Thank you for visiting ${restaurantName}. Please come again.`, 'reset', registrationTokens)
			}
        }
		
        return true
    })

exports.orderServed = functions.firestore
    .document('restaurants/{restaurantId}/orders/{orderId}')
    .onUpdate((change, context) => {
        const before = change.before.data()
        const after = change.after.data()
        const orderId = context.params.orderId
		const registrationTokens = change.after.data().registrationTokensCustomers

        if (change.before.exists) {
            if (before.status !== TableStatus.served && after.status === TableStatus.served) {
				sendNotificationToDevices('Your order has been served', 'Enjoy', 'order', registrationTokens)
            }
        }

        return true
    })

exports.userReceivesRequest = functions.firestore
    .document('restaurants/{restaurantId}/requests/{requestId}')
    .onUpdate((change, context) => {
		const before = change.before.data();
        const beforeRequests = before.requests
        const afterRequests = change.after.data().requests
        const registrationTokens = change.after.data().registrationTokensCustomers
		const restaurantName = before.restaurantName

        if (change.before.exists && afterRequests.length > 1) {
            if (beforeRequests.length !== afterRequests.length) {
                if (!afterRequests[afterRequests.length - 1].createdByUser) {
					sendNotificationToDevices(`From ${restaurantName}`, `${afterRequests[afterRequests.length - 1].request}`, 'request', registrationTokens)
                }
            }
        }

        return true
    })
	
function sendSMS(message, numbers) {
	numbers.forEach((number) => {
		smsClient.messages
			.create({
			    from: '+12058753972',
			    body: message,
			    to: number
			}).then((message) => {
				return message.sid;
			}).catch((err) => {
    	        throw (err);
    	    });
	})
}

function sendNotification(title, body, orderId, category) {
    let payload = {
        data: {
            title,
            body,
            sound: 'default',
            content_available: 'true',
            category,
			android_channel_id: "groak_channel_id",
			tag: category,
        }
    }

    let topic = orderId
    admin.messaging().sendToTopic(topic, payload)
}

function sendNotificationToDevices(title, body, category, registrationTokens) {
	if (registrationTokens === null || registrationTokens === undefined || registrationTokens.length <= 0) {
		return;
	}
    let message = {
        data: {
            title,
            body,
            sound: 'default',
            content_available: 'true',
            category,
			android_channel_id: "groak_channel_id",
			tag: category,
        },
		tokens: registrationTokens
    }

    admin.messaging().sendMulticast(message)
}

function fetchRegistrationTokens(restaurantId) {
	const restaurant = db.collection('restaurants').doc(restaurantId).get()
		.then((querySnapshot) => {
			const registrationTokens = querySnapshot.data().registrationTokens
			return;
	    })
		.catch((error) => {
	        console.log("Error getting documents: ", error);
			throw error;
	    });
}

/**
 * This function gets the current day
 */
function getDay(timezone) {
    const d = new Date();
	const dMoment = moment(d);
	dMoment.tz(timezone)
	
    const weekday = new Array(7);
    weekday[0] = 'sunday';
    weekday[1] = 'monday';
    weekday[2] = 'tuesday';
    weekday[3] = 'wednesday';
    weekday[4] = 'thursday';
    weekday[5] = 'friday';
    weekday[6] = 'saturday';

    return weekday[dMoment.days()];
}

/**
 * In this case the PDT vs PST is always an issue...need to figure out what to do about that
 */
function compareCurrentTimeToRange(startTime, endTime, timezone) {
	const currentDate = new Date();
	const currentDateMoment = moment(currentDate);
	currentDateMoment.tz(timezone);
	const currentDateMinutesFromMidnight = currentDateMoment.hours() * 60 + currentDateMoment.minutes();
	
	const startDate = startTime.toDate();
	const startDateMoment = moment(startDate);
	startDateMoment.tz(timezone);
	const startDateMinutesFromMidnight = startDateMoment.hours() * 60 + startDateMoment.minutes();
	
	const endDate = endTime.toDate();
	const endDateMoment = moment(endDate);
	endDateMoment.tz(timezone);
	let endDateMinutesFromMidnight = endDateMoment.hours() * 60 + endDateMoment.minutes();
	
	if ((endDateMinutesFromMidnight - startDateMinutesFromMidnight) <= 1) {
		return true;
	}
	
	if (endDateMinutesFromMidnight <= startDateMinutesFromMidnight) {
		endDateMinutesFromMidnight = endDateMinutesFromMidnight + 1440;
	}
	
	return (currentDateMinutesFromMidnight >= startDateMinutesFromMidnight && currentDateMinutesFromMidnight <= endDateMinutesFromMidnight)
}

/**
 * This function gets the current date and time
 */
function getCurrentDateTime() {
    const myDate = new Date();
    myDate.setSeconds(0);
    myDate.setMilliseconds(0);
    return myDate;
}

/**
 * This gets the date from the timestamp which is in seconds. The time from the backend is provided in this format
 * and this function converts it into a date that this project can understand.
 *
 * @param {*} timeStamp time receoved from the backend mostly in seconds
 */
function getDateTimeFromTimeStamp(timeStamp) {
    return new Date(timeStamp.seconds * 1000);
}

function getDifferenceInMinutes(timestamp) {
    const difDates = getDateTimeFromTimeStamp(timestamp) - getCurrentDateTime()
    const dif = Math.round((difDates/1000)/60)
    return dif
}