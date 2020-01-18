/**
    * This calculates the distance covered by a drone on the earth's 
    * surface using the great circle distance method
    * https://en.wikipedia.org/wiki/Great-circle_distance 
    */
export const computeDistanceMovedByDrone = (currentLocation, previousLocation) => {
    const earthRadius = 6371e3; //radius of the earth in kilometres - 6371km
    const toRadians = Math.PI / 180;

    const [currentLatInDegrees, currentLongIndegrees] = currentLocation;
    const [previousLatInDegrees, previousLongInDegrees] = previousLocation;

    const changeInLatitude = (currentLatInDegrees - previousLatInDegrees) * toRadians;
    const changeInLongitude = (currentLongIndegrees - previousLongInDegrees) * toRadians;

    const chordLength = Math.pow(Math.sin(changeInLatitude / 2), 2) + Math.cos(currentLatInDegrees)
        * Math.cos(previousLatInDegrees) * Math.sin(changeInLongitude / 2) * Math.sin(changeInLongitude / 2);

    const angularDistance = 2 * Math.atan2(Math.sqrt(chordLength), Math.sqrt(1 - chordLength));

    const arcLength = earthRadius * angularDistance;

    return arcLength;
};


export const timeTakenByDrone = (distanceMoved, droneSpeed) => {
    return distanceMoved * droneSpeed;
}

