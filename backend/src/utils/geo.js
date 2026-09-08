const EARTH_RADIUS_KM = 6371;

export function isValidCoordinate(value, minimum, maximum) {
  return value !== '' && Number.isFinite(Number(value))
    && Number(value) >= minimum && Number(value) <= maximum;
}

export function validateCoordinates(latitude, longitude) {
  if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) {
    const error = new Error('latitude and longitude must be valid coordinates.');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return { latitude: Number(latitude), longitude: Number(longitude) };
}

export function haversineDistanceKm(first, second) {
  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  const arc = 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
  return Number((EARTH_RADIUS_KM * arc).toFixed(2));
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}