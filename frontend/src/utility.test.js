import { computeDistanceMovedByDrone, timeTakenByDrone } from './utility';

test('computes distance moved by the drone', () => {
  const sampleLocation1 = [-33.8934219, 151.20404600000006];
  const sampleLocation2 = [-33.8944219,151.20404600000006];

  const expected = 111.19492664429958; // 111.19492664429958 metres
  const actual = computeDistanceMovedByDrone(sampleLocation1, sampleLocation2);

  expect(actual).toBe(expected);
});

test('time taken by drone', () => {
    const actual = timeTakenByDrone(0.1, 15);
    const expected = 1.5; //1.5 seconds

    expect(actual).toBe(expected);
});
