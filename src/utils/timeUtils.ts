// Convert time string to seconds
export const timeStringToSeconds = (timeStr: string): number => {
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
export const calculatePace = (distance: number, timeSeconds: number): number => {
  return (timeSeconds / (distance / 1000));
};

// Format time display
export const formatTime = (timeStr: string): string => {
  const seconds = timeStringToSeconds(timeStr);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(2);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.padStart(5, '0')}`;
  }
  return `${minutes}:${secs.padStart(5, '0')}`;
};