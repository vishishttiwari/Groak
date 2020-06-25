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

// Eventually you will have to use timezones in this
exports.changeOccupancy = functions.firestore
    .document('restaurants/{restaurantId}/orders/{orderId}')
    .onUpdate((change, context) => {
        const after = change.after.data()		
        const before = change.before.data()
		const restaurantReference = before.restaurantReference
		const updated = after.updated
		const day = getDateTimeFromTimeStamp(updated).getDay()
		var dayString = 'sunday'
		if (day === 1) {
			dayString = 'monday'
		} else if (day === 2) {
			dayString = 'tuesday'
		} else if (day === 3) {
			dayString = 'wednesday'
		} else if (day === 4) {
			dayString = 'thursday'
		} else if (day === 5) {
			dayString = 'friday'
		} else if (day === 6) {
			dayString = 'saturday'
		}

        if (change.before.exists) {			
			if (before.status === TableStatus.available && after.status !== TableStatus.available) {
				let transaction = db.runTransaction(t => {
				    return t.get(restaurantReference)
				        .then(doc => {
							let currentOccupancy = doc.data().currentOccupancy + 1
							let occupancy = doc.data().occupancy
							occupancy[dayString] = Math.max(occupancy[dayString], currentOccupancy)
							t.update(restaurantReference, {occupancy: occupancy, currentOccupancy: currentOccupancy})
							return true
				    });
				}).then(result => {
				  console.log('Transaction success!');
				  return true
				}).catch(err => {
				  console.log('Transaction failure:', err);
				});
			}
			if (before.status !== TableStatus.available && after.status === TableStatus.available) {
				let transaction = db.runTransaction(t => {
				    return t.get(restaurantReference)
				        .then(doc => {
							let currentOccupancy = doc.data().currentOccupancy - 1
							let occupancy = doc.data().occupancy
							occupancy[dayString] = Math.max(occupancy[dayString], currentOccupancy)
							t.update(restaurantReference, {occupancy: occupancy, currentOccupancy: currentOccupancy})
							return true
				    });
				}).then(result => {
				  console.log('Transaction success!');
				  return true
				}).catch(err => {
				  console.log('Transaction failure:', err);
				});
			}
        }
		
        return true
    })

exports.orderServeTimeChanged = functions.firestore
    .document('restaurants/{restaurantId}/orders/{orderId}')
    .onUpdate((change, context) => {
        const before = change.before.data()
        const after = change.after.data()
        const newServeTime = after.serveTime
        const orderId = context.params.orderId
		const restaurantName = change.before.data().restaurantName

        if (change.before.exists) {
            if (before.status === TableStatus.ordered && after.status === TableStatus.approved) {
                sendNotification(`Order approved by ${restaurantName}`, `Order will be served in ${getDifferenceInMinutes(newServeTime)} minutes`, orderId, 'order')
            }
            if (before.status === TableStatus.approved && after.status === TableStatus.approved && getDifferenceInMinutes(before.serveTime) !== getDifferenceInMinutes(after.serveTime)) {
                sendNotification('Serve time updated', `Your serve time has been updated. Your order will now be served in ${getDifferenceInMinutes(newServeTime)} minutes`, orderId, 'order')
            }
			if (before.status !== TableStatus.available && after.status === TableStatus.available) {
				sendNotification(`Thank you for visiting ${restaurantName}`, `Thank you for visiting ${restaurantName}. Please come again.`, orderId, 'reset')
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

        if (change.before.exists) {
            if (before.status !== TableStatus.served && after.status === TableStatus.served) {
                sendNotification('Your order has been served', 'Enjoy', orderId, 'order')
            }
        }

        return true
    })

exports.userReceivesRequest = functions.firestore
    .document('restaurants/{restaurantId}/requests/{requestId}')
    .onUpdate((change, context) => {
        const beforeRequests = change.before.data().requests
        const afterRequests = change.after.data().requests
        const orderId = context.params.requestId
		const restaurantName = change.before.data().restaurantName

        if (change.before.exists && afterRequests.length > 1) {
            if (beforeRequests.length !== afterRequests.length) {
                if (!afterRequests[afterRequests.length - 1].createdByUser) {
                    sendNotification(`From ${restaurantName}`, `${afterRequests[afterRequests.length - 1].request}`, orderId, 'request')
                }
            }
        }

        return true
    })

function sendNotification(title, body, orderId, category) {
    let payload = {
        notification: {
            title,
            body,
            sound: 'default',
            content_available: 'true',
            category,
        }
    }

    let topic = orderId
    admin.messaging().sendToTopic(topic, payload)
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