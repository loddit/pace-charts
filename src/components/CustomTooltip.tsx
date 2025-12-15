import React from 'react';
import type { TooltipProps, ProcessedRecord } from '../data/types';
import { worldRecords } from '../data/worldRecords';
import { timeStringToSeconds, calculatePace, formatTime } from '../utils/timeUtils';

interface CustomTooltipProps extends TooltipProps {
  clickedPoint: ProcessedRecord | null;
}

// Custom tooltip component
export const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  payload, 
  clickedPoint 
}) => {
  // Show tooltip ONLY if point is clicked (remove hover effect)
  const shouldShow = clickedPoint && payload && payload.length > 0 && 
    payload[0].payload.distance === clickedPoint.distance &&
    payload[0].payload.category === clickedPoint.category;
  
  if (shouldShow && payload && payload.length) {
    const data: ProcessedRecord = payload[0].payload;
    const minutes = Math.floor(data.pace / 60);
    const seconds = Math.floor(data.pace % 60);
    
    if (data.category === 'mine') {
      // Calculate percentage vs male/female world records
      const maleRecord = worldRecords.male.find(r => r.distance === data.distance);
      const femaleRecord = worldRecords.female.find(r => r.distance === data.distance);
      
      let malePercent: string | null = null;
      let femalePercent: string | null = null;
      
      if (maleRecord) {
        const maleSeconds = timeStringToSeconds(maleRecord.time);
        const malePace = calculatePace(maleRecord.distance, maleSeconds);
        malePercent = ((malePace / data.pace) * 100).toFixed(1);
      }
      
      if (femaleRecord) {
        const femaleSeconds = timeStringToSeconds(femaleRecord.time);
        const femalePace = calculatePace(femaleRecord.distance, femaleSeconds);
        femalePercent = ((femalePace / data.pace) * 100).toFixed(1);
      }
      
      return (
        <div className="bg-white p-2 sm:p-3 border border-gray-300 rounded shadow-lg text-xs sm:text-sm max-w-[200px] sm:max-w-none">
          <p className="font-bold">{data.displayDistance} - My PB</p>
          <p>Time: {formatTime(data.time)}</p>
          <p className="font-semibold">Pace: {minutes}:{seconds.toString().padStart(2, '0')}/km</p>
          {malePercent && (
            <p className="text-blue-600 mt-1">vs Men WR: {malePercent}%</p>
          )}
          {femalePercent && (
            <p className="text-pink-600">vs Women WR: {femalePercent}%</p>
          )}
        </div>
      );
    }
    
    return (
      <div className="bg-white p-2 sm:p-3 border border-gray-300 rounded shadow-lg text-xs sm:text-sm max-w-[200px] sm:max-w-none">
        <p className="font-bold">{data.displayDistance}</p>
        <p>Athlete: {data.name}</p>
        <p>Year: {data.year}</p>
        <p>Time: {formatTime(data.time)}</p>
        <p className="font-semibold">Pace: {minutes}:{seconds.toString().padStart(2, '0')}/km</p>
      </div>
    );
  }
  return null;
};