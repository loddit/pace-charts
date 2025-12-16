import type { WorldRecord, ProcessedRecord, MyRecords } from '../data/types';
import { distanceLabels } from '../data/worldRecords';
import { timeStringToSeconds, calculatePace } from './timeUtils';

// Process data: calculate pace and log distance
export const processData = (records: WorldRecord[], category: 'male' | 'female', speedFactor: number = 100): ProcessedRecord[] => {
  return records.map(record => {
    const timeSeconds = timeStringToSeconds(record.time);
    // Apply speed factor (lower percentage = slower time)
    const adjustedTimeSeconds = timeSeconds * (100 / speedFactor);
    const pace = calculatePace(record.distance, adjustedTimeSeconds);
    return {
      ...record,
      timeSeconds: adjustedTimeSeconds,
      pace,
      logDistance: Math.log10(record.distance),
      displayDistance: distanceLabels[record.distance] || `${record.distance}m`,
      category
    };
  });
};

// Process my records
export const processRecords = (myRecords: MyRecords, name: string): ProcessedRecord[] => {
  const myData: ProcessedRecord[] = [];
  Object.keys(myRecords).forEach(distance => {
    const time = myRecords[distance];
    if (time && time.trim()) {
      const distanceNum = parseFloat(distance);
      const timeSeconds = timeStringToSeconds(time);
      const pace = calculatePace(distanceNum, timeSeconds);
      myData.push({
        distance: distanceNum,
        time,
        timeSeconds,
        pace,
        logDistance: Math.log10(distanceNum),
        displayDistance: distanceLabels[distanceNum] || `${distanceNum}m`,
        category: 'mine',
        name: name,
        year: new Date().getFullYear()
      });
    }
  });
  myData.sort((a, b) => b.distance - a.distance);
  return myData;
};

// Create fit line data
export const createFitLine = (data: ProcessedRecord[]): ProcessedRecord[] => {
  if (!data || data.length === 0) return [];
  return [...data].sort((a, b) => a.logDistance - b.logDistance);
};

// Generate Y-axis ticks (every 30 seconds, auto-range based on data)
export const generateYAxisTicks = (chartData: ProcessedRecord[]): number[] => {
  if (chartData.length === 0) return [90, 120, 150, 180, 210, 240, 270, 300];
  
  const paces = chartData.map(d => d.pace);
  const minPace = Math.min(...paces);
  const maxPace = Math.max(...paces);
  
  // Round to nearest 30 seconds
  const minTick = Math.floor(minPace / 30) * 30;
  const maxTick = Math.ceil(maxPace / 30) * 30;
  
  const ticks: number[] = [];
  for (let seconds = minTick; seconds <= maxTick; seconds += 30) {
    ticks.push(seconds);
  }
  return ticks;
};

// Color constants to match ControlPanel
export const CHART_COLORS = {
  MALE: '#2563eb',
  FEMALE: '#db2777', 
  MINE: '#16a34a',
  RIVAL: '#f54a00'
} as const;

// Convert data to Nivo format
export const convertToNivoFormat = (
  maleData: ProcessedRecord[],
  femaleData: ProcessedRecord[],
  myData: ProcessedRecord[],
  rivalData: ProcessedRecord[],
  showMale: boolean,
  showFemale: boolean,
  showMyPBs: boolean,
  showRivalPBs: boolean
) => {
  const nivoData: Array<{
    id: string;
    color: string;
    data: Array<{ x: number; y: number; originalData: ProcessedRecord }>;
  }> = [];

  if (showMale && maleData.length > 0) {
    nivoData.push({
      id: 'Men WRs',
      color: CHART_COLORS.MALE,
      data: maleData.map(d => ({
        x: d.logDistance,
        y: d.pace,
        originalData: d
      }))
    });
  }

  if (showFemale && femaleData.length > 0) {
    nivoData.push({
      id: 'Women WRs',
      color: CHART_COLORS.FEMALE,
      data: femaleData.map(d => ({
        x: d.logDistance,
        y: d.pace,
        originalData: d
      }))
    });
  }

  if (showMyPBs && myData.length > 0) {
    nivoData.push({
      id: 'My PBs',
      color: CHART_COLORS.MINE,
      data: myData.map(d => ({
        x: d.logDistance,
        y: d.pace,
        originalData: d
      }))
    });
  }


  if (showRivalPBs && rivalData.length > 0) {
    nivoData.push({
      id: 'Rival\'s PBs',
      color: CHART_COLORS.RIVAL,
      data: rivalData.map(d => ({
        x: d.logDistance,
        y: d.pace,
        originalData: d
      }))
    });
  }

  return nivoData;
};