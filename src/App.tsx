
import React, { useState, useEffect } from 'react';
import { ComposedChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Sun, Moon } from 'lucide-react';

// Types
interface WorldRecord {
  distance: number;
  name: string;
  year: number;
  time: string;
}

interface ProcessedRecord extends WorldRecord {
  timeSeconds: number;
  pace: number;
  logDistance: number;
  displayDistance: string;
  category: 'male' | 'female' | 'mine';
}

interface MyRecords {
  [key: string]: string;
}

interface DistanceLabels {
  [key: number]: string;
}

// World record data - stored as time strings
const worldRecords: { male: WorldRecord[]; female: WorldRecord[] } = {
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
const distanceLabels: DistanceLabels = {
  100: '100m',
  200: '200m',
  400: '400m',
  800: '800m',
  1000: '1000m',
  1500: '1500m',
  5000: '5km',
  10000: '10km',
  21097.5: 'Half',
  42195: 'Full'
};

// Convert time string to seconds
const timeStringToSeconds = (timeStr: string): number => {
  const parts = timeStr.split(':');
  let seconds = 0;
  
  if (parts.length === 3) {
    // Format: H:MM:SS
    seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
  } else if (parts.length === 2) {
    // Format: M:SS or MM:SS
    seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  } else {
    // Format: SS.ss
    seconds = parseFloat(timeStr);
  }
  
  return seconds;
};

// Calculate pace (seconds/km)
const calculatePace = (distance: number, timeSeconds: number): number => {
  return (timeSeconds / (distance / 1000));
};

// Format time display
const formatTime = (timeStr: string): string => {
  const seconds = timeStringToSeconds(timeStr);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(2);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
  }
  return `${minutes}:${secs.padStart(5, '0')}`;
};

// Tooltip types
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProcessedRecord;
  }>;
}

// Custom tooltip component (defined outside of render)
const CustomTooltip: React.FC<TooltipProps & { clickedPoint: ProcessedRecord | null }> = ({ 
  active, 
  payload, 
  clickedPoint 
}) => {
  // Show tooltip on hover OR if point is clicked
  const shouldShow = active || (clickedPoint && payload && payload.length > 0 && 
    payload[0].payload.distance === clickedPoint.distance &&
    payload[0].payload.category === clickedPoint.category);
  
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
          <p className="font-bold">{data.displayDistance} - My PBs</p>
          <p>Time: {formatTime(data.time)}</p>
          <p className="font-semibold">Pace: {minutes}:{seconds.toString().padStart(2, '0')}/km</p>
          {malePercent && (
            <p className="text-blue-600 mt-1">vs Men: {malePercent}%</p>
          )}
          {femalePercent && (
            <p className="text-pink-600">vs Women: {femalePercent}%</p>
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

const AthleticsRecordsChart: React.FC = () => {
  const [showMale, setShowMale] = useState<boolean>(true);
  const [showFemale, setShowFemale] = useState<boolean>(true);
  const [showMyPBs, setShowMyPBs] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [myRecords, setMyRecords] = useState<MyRecords>({});
  const [editingRecords, setEditingRecords] = useState<MyRecords>({});
  const [isDark, setIsDark] = useState<boolean>(false);
  const [clickedPoint, setClickedPoint] = useState<ProcessedRecord | null>(null);

  // Load from localStorage
  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('myAthletics');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMyRecords(parsed);
        } catch (e) {
          console.error('Failed to load records:', e);
        }
      }
      
      const savedTheme = localStorage.getItem('athleticsTheme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    };
    
    loadData();
  }, []);

  // Save to localStorage
  const saveRecords = (records: MyRecords): void => {
    localStorage.setItem('myAthletics', JSON.stringify(records));
    setMyRecords(records);
  };

  // Save theme preference
  const toggleTheme = (): void => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('athleticsTheme', newTheme ? 'dark' : 'light');
  };

  // Handle "MyPBs" toggle
  const handleMyPBsToggle = (checked: boolean): void => {
    if (checked) {
      // Check if user has any data at all
      const recordCount = Object.keys(myRecords).filter(key => myRecords[key] && myRecords[key].trim()).length;
      if (recordCount === 0) {
        // Open modal immediately if no data exists
        openModal();
      }
    }
    setShowMyPBs(checked);
  };

  // Open modal
  const openModal = (): void => {
    setEditingRecords({ ...myRecords });
    setShowModal(true);
  };

  // Handle input change
  const handleInputChange = (distance: number, value: string): void => {
    setEditingRecords({
      ...editingRecords,
      [distance]: value
    });
  };

  // Save edits
  const handleSave = (): void => {
    saveRecords(editingRecords);
    setShowModal(false);
  };

  // Process data: calculate pace and log distance
  const processData = (records: WorldRecord[], category: 'male' | 'female'): ProcessedRecord[] => {
    return records.map(record => {
      const timeSeconds = timeStringToSeconds(record.time);
      const pace = calculatePace(record.distance, timeSeconds);
      return {
        ...record,
        timeSeconds,
        pace,
        logDistance: Math.log10(record.distance),
        displayDistance: distanceLabels[record.distance] || `${record.distance}m`,
        category
      };
    });
  };

  // Process my records
  const processMyRecords = (): ProcessedRecord[] => {
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
          name: 'Me',
          year: new Date().getFullYear()
        });
      }
    });
    return myData;
  };

  const maleData = processData(worldRecords.male, 'male');
  const femaleData = processData(worldRecords.female, 'female');
  const myData = processMyRecords();

  // Combine data based on toggles
  const chartData: ProcessedRecord[] = [
    ...(showMale ? maleData : []),
    ...(showFemale ? femaleData : []),
    ...(showMyPBs ? myData : [])
  ];

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

  return (
    <div
      className={`flex flex-col justify-center w-full min-h-screen p-2 sm:p-6 ${
        isDark ? "bg-gray-900" : "bg-linear-to-br from-blue-50 to-indigo-50"
      }`}
    >
      <div>
        <div className="max-w-6xl mx-auto flex justify-between items-start mb-6 sm:mb-8">
          <div className="w-12" />
          <div className="flex-1 flex flex-col items-center gap-2 justify-center">
            <svg
              width={200}
              height={32}
              viewBox="0 0 518.8 68.001"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Pace Chart Title"
            >
              <g
                id="svgGroup"
                strokeLinecap="round"
                fillRule="evenodd"
                fontSize="9pt"
                stroke="#000"
                strokeWidth="0.25mm"
                fill={isDark ? "#eee" : "#000"}
              >
                <path
                  d="M 303.1 35.7 L 303.1 66.5 L 283.1 66.5 L 283.1 1.5 L 303.1 0 L 303.1 18.3 Q 309.5 15 317.3 15 Q 325.1 15 329.1 18.05 Q 333.1 21.1 333.1 26.5 L 333.1 66.5 L 313.1 66.5 L 313.1 31.5 L 310 31.5 Q 306.4 31.5 304.75 32.25 Q 303.1 33 303.1 35.7 Z M 516.2 18.1 L 513.9 31.7 Q 506.1 29.5 498.3 29.5 Q 495.9 29.5 491.5 29.9 L 491.5 33.1 Q 507.7 33.1 513.5 37.9 Q 516.4 40.3 517.6 43.15 Q 518.8 46 518.8 50.05 Q 518.8 54.1 517.85 57.3 Q 516.9 60.5 514.95 62.4 Q 513 64.3 510.9 65.5 Q 508.8 66.7 505.4 67.2 Q 500.1 68 493.1 68 Q 480.7 68 470.7 65.1 L 473.2 50.9 Q 481.6 53.5 491.4 53.5 Q 495.9 53.5 499.6 53.1 L 499.6 49.9 Q 483.6 49.9 477.55 45.7 Q 471.5 41.5 471.5 31.75 Q 471.5 22 477.95 18.5 Q 484.4 15 495.6 15 Q 506.8 15 516.2 18.1 Z M 274.6 48.6 L 276.1 65.4 Q 269.8 68 260.3 68 Q 250.8 68 245.05 66 Q 239.3 64 236 59.7 Q 232.7 55.4 231.4 49.6 Q 230.1 43.8 230.1 35.3 Q 230.1 26.8 231.4 20.95 Q 232.7 15.1 236 10.8 Q 242.4 2.5 259.5 2.5 Q 263.3 2.5 268.45 3.25 Q 273.6 4 276.1 5.1 L 273.1 20.4 Q 266.6 19 261.2 19 Q 255.8 19 253.7 20 Q 251.6 21 251.6 24 L 251.6 50.2 Q 255.5 51 259.5 51 Q 268 51 274.6 48.6 Z M 106.7 31.5 L 106.7 66.5 L 96.7 66.5 L 91 60.8 Q 88.1 64.2 83.1 66.1 Q 78.1 68 73.65 68 Q 69.2 68 66.5 67.3 Q 63.8 66.6 61.2 64.9 Q 55.5 61.3 55.5 51.5 Q 55.5 33.5 82.7 33.5 L 86.7 33.5 L 86.7 29.9 Q 83.5 29.7 81.4 29.7 Q 70.1 29.7 62 32.4 L 59.6 18.1 Q 69.6 15 82.7 15 Q 106.7 15 106.7 31.5 Z M 390.3 31.5 L 390.3 66.5 L 380.3 66.5 L 374.6 60.8 Q 371.7 64.2 366.7 66.1 Q 361.7 68 357.25 68 Q 352.8 68 350.1 67.3 Q 347.4 66.6 344.8 64.9 Q 339.1 61.3 339.1 51.5 Q 339.1 33.5 366.3 33.5 L 370.3 33.5 L 370.3 29.9 Q 367.1 29.7 365 29.7 Q 353.7 29.7 345.6 32.4 L 343.2 18.1 Q 353.2 15 366.3 15 Q 390.3 15 390.3 31.5 Z M 181.1 49.5 L 181.1 53 Q 184.1 53.3 187.1 53.3 Q 196.4 53.3 205.9 50.3 L 208.3 65 Q 197.1 68 186.1 68 Q 172.1 68 165.85 61.45 Q 159.6 54.9 159.6 41.5 Q 159.6 28.1 165.85 21.55 Q 172.1 15 186.05 15 Q 200 15 205.3 18.8 Q 210.6 22.6 210.6 33 Q 210.6 41.8 204.25 45.65 Q 197.9 49.5 181.1 49.5 Z M 33 51.4 L 20 51.4 L 20 66.5 L 0 66.5 L 0 4 L 31.5 4 Q 53 4 53 27.1 Q 53 39.8 47.4 45.9 Q 45.3 48.2 41.6 49.8 Q 37.9 51.4 33 51.4 Z M 152.4 51.5 L 153.6 65.9 Q 148.4 68 140.2 68 Q 126.2 68 119.95 61.45 Q 113.7 54.9 113.7 41.5 Q 113.7 28.1 119.95 21.55 Q 126.2 15 140.2 15 Q 148.9 15 153.6 17.1 L 151.2 30.7 Q 145.9 29.6 142.8 29.6 Q 135.2 29.6 135.2 34.9 L 135.2 52.8 Q 138.1 53.4 142.65 53.4 Q 147.2 53.4 152.4 51.5 Z M 438.8 29.4 L 433.8 29.4 L 433.8 16.5 L 438.8 16.5 L 438.8 8.5 L 458.8 3.5 L 458.8 16.5 L 465.7 16.5 L 465.7 29.4 L 458.8 29.4 L 458.8 52.2 Q 461.4 52.7 464.7 52.9 L 463.8 67.6 Q 450.1 67.6 446 66.1 Q 440.9 64.3 439.6 61.3 Q 438.8 59.5 438.8 57.1 L 438.8 29.4 Z M 399.3 66.5 L 399.3 16.5 L 409.3 16.5 L 414.8 22.1 Q 420.7 16.7 429.6 15 L 430.8 33.9 Q 428.4 34 424.55 35.1 Q 420.7 36.2 419.3 37.9 L 419.3 66.5 L 399.3 66.5 Z M 24.6 20 L 20 20 L 20 35.4 L 24.6 35.4 Q 28.2 35.4 29.85 34.65 Q 31.5 33.9 31.5 31.2 L 31.5 24.2 Q 31.5 21.5 29.85 20.75 Q 28.2 20 24.6 20 Z M 75.7 49.3 L 75.7 53.4 L 79.8 53.4 Q 84.2 53.4 85.45 52.4 Q 86.7 51.4 86.7 49.8 L 86.7 45.1 L 82.6 45.1 Q 79 45.1 77.35 45.85 Q 75.7 46.6 75.7 49.3 Z M 359.3 49.3 L 359.3 53.4 L 363.4 53.4 Q 367.8 53.4 369.05 52.4 Q 370.3 51.4 370.3 49.8 L 370.3 45.1 L 366.2 45.1 Q 362.6 45.1 360.95 45.85 Q 359.3 46.6 359.3 49.3 Z M 181.1 33.8 L 181.1 37.9 L 185.2 37.9 Q 188.8 37.9 190.45 37.15 Q 192.1 36.4 192.1 33.7 L 192.1 29.6 L 188 29.6 Q 184.4 29.6 182.75 30.35 Q 181.1 31.1 181.1 33.8 Z"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
            <h2
              className={`text-xs sm:text-sm text-center mt-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Compare Your Personal Bests to World Records
            </h2>
          </div>

          {/* Theme toggle switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div
              className={`w-10 h-6 rounded-full peer transition-colors ${
                isDark ? "bg-blue-600" : "bg-gray-300"
              } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500`}
            >
              <div
                className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform flex items-center justify-center ${
                  isDark ? "translate-x-4" : "translate-x-0"
                }`}
              >
                {isDark ? (
                  <Moon size={14} className="text-gray-700" />
                ) : (
                  <Sun size={14} className="text-yellow-500" />
                )}
              </div>
            </div>
          </label>
        </div>

        <div
          className={`max-w-6xl mx-auto rounded-xl shadow-sm p-3 sm:p-6 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Toggle switches */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMale}
                  onChange={(e) => setShowMale(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  style={{
                    accentColor: "#2563eb",
                  }}
                />
                <span className="font-medium text-sm sm:text-base text-blue-600">
                  Men WRs
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFemale}
                  onChange={(e) => setShowFemale(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  style={{
                    accentColor: "#db2777",
                  }}
                />
                <span className="font-medium text-sm sm:text-base text-pink-600">
                  Women WRs
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMyPBs}
                  onChange={(e) => handleMyPBsToggle(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  style={{
                    accentColor: "#16a34a",
                  }}
                />
                <span className="font-medium text-sm sm:text-base text-green-600">
                  My PBs
                </span>
              </label>

              {showMyPBs && (
                <button
                  onClick={openModal}
                  className={`text-xs px-2 py-1 rounded transition-all ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Update My PBs
                </button>
              )}
            </div>
          </div>

          {/* Chart */}
          {!showEmptyState ? (
            <ResponsiveContainer
              width="100%"
              height={400}
              className="sm:h-[500px]"
            >
              <ComposedChart
                margin={{ top: 20, right: 10, bottom: 20, left: 10 }}
                onClick={(e: unknown) => {
                  // Click outside points to close tooltip
                  if (!e || !(e as { activePayload?: unknown }).activePayload) {
                    setClickedPoint(null);
                  }
                }}
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
                    onClick={(data: ProcessedRecord) => setClickedPoint(data)}
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
                    onClick={(data: ProcessedRecord) => setClickedPoint(data)}
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
                    onClick={(data: ProcessedRecord) => setClickedPoint(data)}
                    style={{ cursor: "pointer" }}
                    legendType="none"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
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
          )}

          {/* Modal */}
          {showModal && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <div
                className={`rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
                  isDark ? "bg-gray-800 text-white" : "bg-white"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Edit My Personal Bests
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    100, 200, 400, 800, 1000, 1500, 5000, 10000, 21097.5, 42195,
                  ].map((distance) => {
                    const maleWR = worldRecords.male.find(
                      (r) => r.distance === distance
                    );
                    const placeholder = maleWR ? maleWR.time : "";

                    return (
                      <div key={distance} className="flex items-center gap-2">
                        <label className="w-16 sm:w-20 font-medium text-sm sm:text-base">
                          {distanceLabels[distance]}:
                        </label>
                        <input
                          type="text"
                          value={editingRecords[distance] || ""}
                          onChange={(e) =>
                            handleInputChange(distance, e.target.value)
                          }
                          placeholder={placeholder}
                          className={`flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-white border-gray-300"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to clear all personal records?"
                        )
                      ) {
                        setEditingRecords({});
                        saveRecords({});
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded transition-all ${
                      isDark
                        ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className={`mt-4 sm:mt-6 flex flex-col gap-2 text-sm items-center px-2 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <p>
            WRs data source:{" "}
            <a
              href="https://en.wikipedia.org/wiki/List_of_world_records_in_athletics"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:no-underline ${
                isDark ? "text-stone-400" : "text-stone-600"
              }`}
            >
              Wikipedia
            </a>
          </p>
          <div className="flex items-center gap-2">
            Presented by
            <a href="https://parco.run" target='_blank'>
              <img
                src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIHZpZXdCb3g9IjAgMCAzMDAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iIzBlYTVlOSI+CjxwYXRoIGQ9Im00MS4yOTMgNTkuNDU0aC0xNS45NHYxOC41MTVoLTI0LjUyM3YtNzYuNjM1aDM4LjYyNHEyNi4zNjMgMCAyNi4zNjMgMjguMzI0IDAgMTUuNTcyLTYuODY2NiAyMy4wNTItMi41NzUgMi44MjAyLTcuMTExNyA0Ljc4Mi00LjUzNjggMS45NjE4LTEwLjU0NSAxLjk2MTh6bS0xNS45NC0zOC41MDF2MTguODgzaDUuNjQwM3E0LjQxNDEgMCA2LjQzNzQtMC45MTk2MyAyLjAyMzEtMC45MTk2MyAyLjAyMzEtNC4yMzAzdi04LjU4MzFxMC0zLjMxMDYtMi4wMjMxLTQuMjMwM3QtNi40Mzc0LTAuOTE5NjN6IiBzdHJva2Utd2lkdGg9Ii4xMjI2MiIvPgo8cGF0aCBkPSJtMTAxLjM5IDE0LjU4cTI5LjQyOCAwIDI5LjQyOCAyMC4yMzF2NDIuOTE1aC0xMi4yNjJsLTYuOTg5MS02Ljk4OTFxLTMuNTU1OSA0LjE2OS05LjY4NjcgNi40OTg3LTYuMTMwOCAyLjMyOTctMTEuNTg3IDIuMzI5Ny01LjQ1NjUgMC04Ljc2NzEtMC44NTgzMS0zLjMxMDYtMC44NTgzMi02LjQ5ODctMi45NDI4LTYuOTg5MS00LjQxNDMtNi45ODkxLTE2LjQzMSAwLTIyLjA3MSAzMy4zNTEtMjIuMDcxaDQuOTA0NnYtNC40MTQxcS0zLjkyMzctMC4yNDUyMy02LjQ5ODctMC4yNDUyMy0xMy44NTYgMC0yMy43ODcgMy4zMTA2bC0yLjk0MjgtMTcuNTM0cTEyLjI2Mi0zLjgwMTEgMjguMzI0LTMuODAxMXptLTguNTgzMSA0Mi4wNTd2NS4wMjczaDUuMDI3M3E1LjM5NTIgMCA2LjkyNzktMS4yMjYyIDEuNTMyNy0xLjIyNjIgMS41MzI3LTMuMTg4di01Ljc2MjloLTUuMDI3M3EtNC40MTQyIDAtNi40Mzc0IDAuOTE5NjMtMi4wMjMxIDAuOTE5NjMtMi4wMjMxIDQuMjMwM3oiIHN0cm9rZS13aWR0aD0iLjEyMjYyIi8+CjxwYXRoIGQ9Im0xMzguOTEgMTYuNjYxaDEyLjI2Mmw2Ljc0MzggNi44NjY2cTcuMjM0NC02LjYyMTMgMTguMTQ3LTguNzA1OGwxLjQ3MTQgMjMuMTc1cS0yLjk0MjggMC4xMjI2Mi03LjY2MzYgMS40NzE0LTQuNzIwNyAxLjM0ODgtNi40Mzc0IDMuNDMzMnYzNS4wNjloLTI0LjUyM3oiIHN0cm9rZS13aWR0aD0iLjEyMjYyIi8+CjxwYXRoIGQ9Im0yMzAuNSA1OS4zMzQgMS40NzE0IDE3LjY1N3EtNi4zNzYxIDIuNTc1LTE2LjQzMSAyLjU3NS0xNy4xNjcgMC0yNC44My04LjAzMTMtNy42NjM1LTguMDMxMy03LjY2MzUtMjQuNDYyIDAtMTYuNDMxIDcuNjYzNS0yNC40NjIgNy42NjM2LTguMDMxMyAyNC44My04LjAzMTMgMTAuNjY4IDAgMTYuNDMxIDIuNTc1bC0yLjk0MjggMTYuNjc2cS02LjQ5ODctMS4zNDg4LTEwLjMtMS4zNDg4LTkuMzE4OCAwLTkuMzE4OCA2LjQ5ODd2MjEuOTQ5cTMuNTU1OSAwLjczNTcgOS4xMzQ5IDAuNzM1NyA1LjU3OSAwIDExLjk1NS0yLjMyOTd6IiBzdHJva2Utd2lkdGg9Ii4xMjI2MiIvPgo8cGF0aCBkPSJtMjQyLjU5IDcxLjUzNHEtNy42NjM2LTguMDMxMy03LjY2MzYtMjQuNDYyIDAtMTYuNDMxIDcuNjYzNi0yNC40NjIgNy42NjM2LTguMDMxMyAyNC44My04LjAzMTMgMTcuMTY3IDAgMjQuODMgOC4wMzEzIDcuNjYzNiA4LjAzMTMgNy42NjM2IDI0LjQ2MiAwIDE2LjQzMS03LjY2MzYgMjQuNDYyLTcuNjYzNiA4LjAzMTMtMjQuODMgOC4wMzEzLTE3LjE2NyAwLTI0LjgzLTguMDMxM3ptMTguNy0zMy45MDR2MjQuMDMzaDMuODAxMXE0LjQxNDIgMCA2LjQzNzQtMC45MTk2MyAyLjAyMzEtMC45MTk2MyAyLjAyMzEtNC4yMzAzdi0yNC4wMzNoLTMuODAxMXEtNC40MTQzIDAtNi40Mzc0IDAuOTE5NjMtMi4wMjMxIDAuOTE5NjMtMi4wMjMxIDQuMjMwM3oiIHN0cm9rZS13aWR0aD0iLjEyMjYyIi8+Cjwvc3ZnPgo="
                alt="Pace Charts"
                width="72"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleticsRecordsChart;
