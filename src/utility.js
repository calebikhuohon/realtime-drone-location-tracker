/**
 * take the drone location command as string and return data as an object
 * @param {String} locationBuffer 
 */
function parseDroneLocation (locationBuffer) {
  const stringLocation = Buffer.isBuffer(locationBuffer) ? locationBuffer.toString() : locationBuffer;

  const reducer = (finalDataObject, nextDataPoint) => {
    if (!nextDataPoint.includes(':')) {
      return finalDataObject;
    }

    let [key, value] = nextDataPoint.split(':');
    const isCommaSeperated = value.includes(',');

    if (isCommaSeperated) {
      value = value.split(',').map(val => (
        Number.isNaN(parseFloat(val)) ? val : parseFloat(val)
      ));
    } else {
      value = Number.isNaN(parseFloat(value)) ? value : parseFloat(value);
    }

    return { ...finalDataObject, [key]: value };
  };

  return stringLocation.split(';').reduce(reducer, {});
}

export {
  parseDroneLocation,
};