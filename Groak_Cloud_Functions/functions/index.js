const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

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
					const registrationTokens = querySnapshot.data().registrationTokens
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
		
		console.log('1')
		
		const restaurant = db.collection('restaurants').doc(context.params.restaurantId).get()
			.then((querySnapshot) => {
				console.log('2')
				if (querySnapshot) {
					console.log('3')
					const registrationTokens = querySnapshot.data().registrationTokens
					if (registrationTokens && change.before.exists) {
						console.log('4')
						if (beforeRequests.length !== afterRequests.length) {
							console.log('5')
							if (afterRequests[afterRequests.length - 1].createdByUser) {
								console.log('6')
								sendNotificationToDevices(`New request from customers at ${change.after.data().table}`, `New request from customers at ${change.after.data().table}`, 'request', registrationTokens)
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
	console.log(restaurantId)
	const restaurant = db.collection('restaurants').doc(restaurantId).get()
		.then((querySnapshot) => {
			const registrationTokens = querySnapshot.data().registrationTokens
	        console.log(registrationTokens)
			return;
	    })
		.catch((error) => {
	        console.log("Error getting documents: ", error);
			throw error;
	    });
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