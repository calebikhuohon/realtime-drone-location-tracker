import {parseDroneLocation} from '../src/utility';
import assert from 'assert';

describe('parseDroneLocation function', () => {
  it('parse drone location', () => {
    let data = 'speed:10;location:51.507351,-0.127758;';
    let expected = {
      speed: 10,
      location: [51.507351,-0.127758],
    };

    let actual = parseDroneLocation(data);
    assert.deepEqual(actual, expected);
  });
});