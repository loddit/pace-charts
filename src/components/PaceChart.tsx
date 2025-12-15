import React from 'react';
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import type { ProcessedRecord } from '../data/types';
import { distanceLabels } from '../data/worldRecords';
import { CustomTooltip } from './CustomTooltip';

interface PaceChartProps {
  chartData: ProcessedRecord[];
  maleData: ProcessedRecord[];
  femaleData: ProcessedRecord[];
  myData: ProcessedRecord[];
  showMale: boolean;
  showFemale: boolean;
  showMyPBs: boolean;
  isDark: boolean;
  clickedPoint: ProcessedRecord | null;
  onPointClick: (data: ProcessedRecord) => void;
  onChartClick: (e: unknown) => void;
}

export const PaceChart: React.FC<PaceChartProps> = ({
  chartData,
  maleData,
  femaleData,
  myData,
  showMale,
  showFemale,
  showMyPBs,
  isDark,
  clickedPoint,
  onPointClick,
  onChartClick
}) => {
  // Create fit line data
  const createFitLine = (data: ProcessedRecord[]): ProcessedRecord[] => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => a.logDistance - b.logDistance);
  };

  const maleFitLine = createFitLine(maleData);
  const femaleFitLine = createFitLine(femaleData);
  const myFitLine = createFitLine(myData);

  // Get all scatter logDistance values as ticks
  const allDistances = [...maleData, ...femaleData, ...myData];
  const uniqueLogDistances = [...new Set(allDistances.map(d => d.logDistance))].sort((a, b) => a - b);
  const xAxisTicks = uniqueLogDistances;

  // Generate Y-axis ticks (every 30 seconds, auto-range based on data)
  const generateYAxisTicks = (): number[] => {
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

  const yAxisTicks = generateYAxisTicks();
  const yAxisDomain: [number, number] = chartData.length > 0 
    ? [Math.min(...yAxisTicks), Math.max(...yAxisTicks)]
    : [90, 300];

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

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
      className="sm:h-[500px]"
    >
      <ComposedChart
        margin={{ top: 20, right: 10, bottom: 20, left: 10 }}
        onClick={onChartClick}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "#4b5563" : "#e0e0e0"}
        />
        <XAxis
          type="number"
          dataKey="logDistance"
          name="Distance"
          domain={["dataMin - 0.1", "dataMax + 0.1"]}
          ticks={xAxisTicks.length > 0 ? xAxisTicks : undefined}
          tickFormatter={(value: number) => {
            const distance = Math.pow(10, value);
            return (
              distanceLabels[Math.round(distance * 10)/10] ||
              `${Math.round(distance)}m`
            );
          }}
          tick={{ fontSize: 10, fill: isDark ? "#d1d5db" : "#000" }}
        />
        <YAxis
          type="number"
          dataKey="pace"
          name="Pace"
          reversed={true}
          domain={yAxisDomain}
          ticks={yAxisTicks}
          width={35}
          tickFormatter={(value: number) => {
            const minutes = Math.floor(value / 60);
            const seconds = Math.floor(value % 60);
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
          }}
          tick={{ fontSize: 10, fill: isDark ? "#d1d5db" : "#000" }}
        />
        <Tooltip
          content={<CustomTooltip clickedPoint={clickedPoint} />}
          active={false}
        />

        {/* Fit lines - hidden from legend */}
        {showMale && maleFitLine.length > 1 && (
          <Line
            type="monotone"
            dataKey="pace"
            data={maleFitLine}
            stroke="#93c5fd"
            strokeWidth={2}
            dot={false}
            legendType="none"
          />
        )}
        {showFemale && femaleFitLine.length > 1 && (
          <Line
            type="monotone"
            dataKey="pace"
            data={femaleFitLine}
            stroke="#fbcfe8"
            strokeWidth={2}
            dot={false}
            legendType="none"
          />
        )}
        {showMyPBs && myFitLine.length > 1 && (
          <Line
            type="monotone"
            dataKey="pace"
            data={myFitLine}
            stroke="#86efac"
            strokeWidth={2}
            dot={false}
            legendType="none"
          />
        )}

        {/* Scatter points */}
        {showMale && (
          <Scatter
            name=""
            data={maleData}
            fill="#2563eb"
            shape="circle"
            r={6}
            onClick={onPointClick}
            style={{ cursor: "pointer" }}
            legendType="none"
          />
        )}
        {showFemale && (
          <Scatter
            name=""
            data={femaleData}
            fill="#db2777"
            shape="circle"
            r={6}
            onClick={onPointClick}
            style={{ cursor: "pointer" }}
            legendType="none"
          />
        )}
        {showMyPBs && myData.length > 0 && (
          <Scatter
            name=""
            data={myData}
            fill="#16a34a"
            shape="circle"
            r={6}
            onClick={onPointClick}
            style={{ cursor: "pointer" }}
            legendType="none"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};