import type { WorldRecord, DistanceLabels } from './types';

// World record data - stored as time strings
export const worldRecords: { male: WorldRecord[]; female: WorldRecord[] } = {
  male: [
    { distance: 100, name: 'Usain Bolt', year: 2009, time: '9.58' },
    { distance: 200, name: 'Usain Bolt', year: 2009, time: '19.19' },
    { distance: 400, name: 'Wayde van Niekerk', year: 2016, time: '43.03' },
    { distance: 800, name: 'David Rudisha', year: 2012, time: '1:40.91' },
    { distance: 1000, name: 'Noah Ngeny', year: 1999, time: '2:11.96' },
    { distance: 1500, name: 'Hicham El Guerrouj', year: 1998, time: '3:26.00' },
    { distance: 5000, name: 'Joshua Cheptegei', year: 2020, time: '12:35.36' },
    { distance: 10000, name: 'Joshua Cheptegei', year: 2020, time: '26:11.00' },
    { distance: 21097.5, name: 'Jacob Kiplimo', year: 2021, time: '57:31' },
    { distance: 42195, name: 'Kelvin Kiptum', year: 2023, time: '2:00:35' }
  ],
  female: [
    { distance: 100, name: 'Florence Griffith-Joyner', year: 1988, time: '10.49' },
    { distance: 200, name: 'Florence Griffith-Joyner', year: 1988, time: '21.34' },
    { distance: 400, name: 'Marita Koch', year: 1985, time: '47.60' },
    { distance: 800, name: 'Jarmila Kratochvílová', year: 1983, time: '1:53.28' },
    { distance: 1000, name: 'Svetlana Masterkova', year: 1996, time: '2:28.98' },
    { distance: 1500, name: 'Faith Kipyegon', year: 2023, time: '3:49.04' },
    { distance: 5000, name: 'Faith Kipyegon', year: 2023, time: '14:05.20' },
    { distance: 10000, name: 'Beatrice Chebet', year: 2024, time: '28:54.14' },
    { distance: 21097.5, name: 'Ruth Chepngetich', year: 2024, time: '1:04:16' },
    { distance: 42195, name: 'Ruth Chepngetich', year: 2024, time: '2:09:56' }
  ]
};

// Distance labels
export const distanceLabels: DistanceLabels = {
  100: '100m',
  200: '200m',
  400: '400m',
  800: '800m',
  1000: '1000m',
  1500: '1500m',
  5000: '5000m',
  10000: '10000m',
  21097.5: 'Half',
  42195: 'Full'
};

// Standard distances for form inputs
export const standardDistances = [
  100, 200, 400, 800, 1000, 1500, 5000, 10000, 21097.5, 42195
];
