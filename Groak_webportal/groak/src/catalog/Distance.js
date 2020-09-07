import { getPreciseDistance } from 'geolib';

const distanceThresholdMeters = 1000;

export const isNearRestaurant = async (latitude, longitude, snackbar) => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const distance = getPreciseDistance(
                {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }, {
                    latitude,
                    longitude,
                }, 0.01,
            );

            if (distance) {
                resolve(distance <= distanceThresholdMeters);
            } else {
                snackbar('Error occurred');
                reject(new Error('Could not calculate distance'));
            }
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                snackbar('Location not available. Please allow to access your location to use Groak.', { variant: 'error' });
            } else {
                snackbar(`Error occurred: ${error.message}`, { variant: 'error' });
            }
            reject(error);
        });
    });
};
