import {parseDroneLocation} from '../src/utility';
import assert from 'assert';

describe('parseDroneLocation function', () => {
  it('parse drone location', () => {
    let location = 'droneId:12345;location:51.507351,-0.127758;';
    let expected = {
      droneId: 12345,
      location: [51.507351,-0.127758],
    };

    let actual = parseDroneLocation(location);
    assert.deepEqual(actual, expected);
  });
});