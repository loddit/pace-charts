import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { ProcessedRecord } from '../data/types';
import { distanceLabels, worldRecords } from '../data/worldRecords';
import { convertToNivoFormat, generateYAxisTicks, CHART_COLORS } from '../utils/dataProcessing';
import { timeStringToSeconds, calculatePace } from '../utils/timeUtils';

interface PaceChartProps {
  chartData: ProcessedRecord[];
  maleData: ProcessedRecord[];
  femaleData: ProcessedRecord[];
  myData: ProcessedRecord[];
  rivalData: ProcessedRecord[];
  showMale: boolean;
  showFemale: boolean;
  showMyPBs: boolean;
  showRivalPBs: boolean;
  isDark: boolean;
}

export const PaceChart: React.FC<PaceChartProps> = ({
  chartData,
  maleData,
  femaleData,
  myData,
  rivalData,
  showMale,
  showFemale,
  showMyPBs,
  showRivalPBs,
  isDark,
}) => {
  const showEmptyState = chartData.length === 0;

  if (showEmptyState) {
    return (
      <div
        className={`text-center py-12 sm:py-20 ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <p className="text-base sm:text-lg">No data to display</p>
        <p className="text-xs sm:text-sm mt-2">
          Please select at least one category above
        </p>
      </div>
    );
  }

  // Convert data to Nivo format
  const nivoData = convertToNivoFormat(maleData, femaleData, myData, rivalData, showMale, showFemale, showMyPBs, showRivalPBs);

  // Get all unique log distances for x-axis ticks
  const allDistances = [...maleData, ...femaleData, ...myData];
  const uniqueLogDistances = [...new Set(allDistances.map(d => d.logDistance))].sort((a, b) => a - b);

  // Generate Y-axis ticks
  const yAxisTicks = generateYAxisTicks(chartData);
  const yMin = Math.min(...yAxisTicks);
  const yMax = Math.max(...yAxisTicks);

  return (
    <div 
      style={{ height: '400px' }} 
      className="sm:h-[500px]"
    >
      <ResponsiveLine
        data={nivoData}
        margin={{ top: 20, right: 0, bottom: 50, left: 30 }}
        xScale={{ type: 'linear', min: 'auto', max: "auto" }}
        yScale={{ 
          type: 'linear', 
          min: yMin, // Reversed for pace (lower is better)
          max: yMax,
          reverse: true
        }}
        curve="linear"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 45,
          tickValues: uniqueLogDistances,
          format: (value: number) => {
            const distance = Math.pow(10, value);
            return distanceLabels[Math.round(distance * 10)/10] || `${Math.round(distance)}m`;
          }
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: yAxisTicks,
          format: (value: number) => {
            const minutes = Math.floor(value / 60);
            const seconds = Math.floor(value % 60);
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
          }
        }}
        useMesh={true}
        enableGridX={true}
        enableGridY={true}
        gridXValues={uniqueLogDistances}
        gridYValues={yAxisTicks}
        enableTouchCrosshair={false}
        theme={{
          background: 'transparent',
          text: {
            fontSize: 10,
            fill: isDark ? '#d1d5db' : '#000',
          },
          axis: {
            domain: {
              line: {
                stroke: isDark ? '#4b5563' : '#e0e0e0',
                strokeWidth: 1,
              },
            },
            legend: {
              text: {
                fontSize: 12,
                fill: isDark ? '#d1d5db' : '#000',
              },
            },
            ticks: {
              line: {
                stroke: isDark ? '#4b5563' : '#e0e0e0',
                strokeWidth: 1,
              },
              text: {
                fontSize: 10,
                fill: isDark ? '#d1d5db' : '#000',
              },
            },
          },
          grid: {
            line: {
              stroke: isDark ? '#4b5563' : '#e0e0e0',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            },
          },
          crosshair: {
            line: {
              stroke: isDark ? '#6b7280' : '#9ca3af',
              strokeWidth: 1,
            },
          },
        }}
        tooltip={({ point }) => {
          if (!('data' in point) || !point.data) return null;
          const data = (point.data as any).originalData as ProcessedRecord;
          if (!data) return null;

          const minutes = Math.floor(data.pace / 60);
          const seconds = Math.floor(data.pace % 60);

          // Only show tooltip if this point is clicked

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
              <div className="w-48 bg-white p-2 sm:p-3 border border-gray-300 rounded shadow-lg text-xs sm:text-sm max-w-[200px] sm:max-w-none">
                <p className="font-bold">{data.displayDistance} - {data.name}</p>
                <p>Time: {data.time}</p>
                <p className="font-semibold">Pace: {minutes}:{seconds.toString().padStart(2, '0')}/km</p>
                {malePercent && (
                  <p className="mt-1" style={{ color: CHART_COLORS.MALE }}>vs Men WR: {malePercent}%</p>
                )}
                {femalePercent && (
                  <p style={{ color: CHART_COLORS.FEMALE }}>vs Women WR: {femalePercent}%</p>
                )}
              </div>
            );
          }

          return (
            <div className="w-48 bg-white p-2 sm:p-3 border border-gray-300 rounded shadow-lg text-xs sm:text-sm max-w-[200px] sm:max-w-none">
              <p className="font-bold">{data.displayDistance} World Record</p>
              <p>Athlete: {data.name}</p>
              <p>Year: {data.year}</p>
              <p>Time: {data.time}</p>
              <p className="font-semibold">Pace: {minutes}:{seconds.toString().padStart(2, '0')}/km</p>
            </div>
          );
        }}
        enableSlices={false}
        colors={({ id }) => {
          switch (id) {
            case 'Men WRs': return CHART_COLORS.MALE;
            case 'Women WRs': return CHART_COLORS.FEMALE;
            case 'My PBs': return CHART_COLORS.MINE;
            case 'Rival\'s PBs': return CHART_COLORS.RIVAL;
            default: return CHART_COLORS.MALE;
          }
        }}
        lineWidth={2}
        pointSize={10}
        pointSymbol={({ size, color, borderWidth, datum }) => {
          // Get the series color based on the serie id
          const serieId = (datum as any).serie?.id;
          let pointColor = color;
          
          switch (serieId) {
            case 'Men WRs':
              pointColor = CHART_COLORS.MALE;
              break;
            case 'Women WRs':
              pointColor = CHART_COLORS.FEMALE;
              break;
            case 'My PBs':
              pointColor = CHART_COLORS.MINE;
              break;
          }
          
          return (
            <circle
              r={size / 2}
              fill={pointColor}
              stroke={pointColor}
              strokeWidth={borderWidth}
              style={{ cursor: 'pointer' }}
            />
          );
        }}
      />
    </div>
  );
};
