import React from 'react';
import { Edit, WandSparkles } from 'lucide-react';

// CSS for custom slider styling
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

interface ControlPanelProps {
  showMale: boolean;
  showFemale: boolean;
  showMyPBs: boolean;
  maleSpeedFactor: number;
  femaleSpeedFactor: number;
  showMaleSlider: boolean;
  showFemaleSlider: boolean;
  onMaleToggle: (checked: boolean) => void;
  onFemaleToggle: (checked: boolean) => void;
  onMyPBsToggle: (checked: boolean) => void;
  onUpdateMyPBs: () => void;
  onMaleSpeedFactorChange: (factor: number) => void;
  onFemaleSpeedFactorChange: (factor: number) => void;
  onToggleMaleSlider: () => void;
  onToggleFemaleSlider: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  showMale,
  showFemale,
  showMyPBs,
  maleSpeedFactor,
  femaleSpeedFactor,
  showMaleSlider,
  showFemaleSlider,
  onMaleToggle,
  onFemaleToggle,
  onMyPBsToggle,
  onUpdateMyPBs,
  onMaleSpeedFactorChange,
  onFemaleSpeedFactorChange,
  onToggleMaleSlider,
  onToggleFemaleSlider
}) => {
  return (
    <>
      <style>{sliderStyles}</style>
      <div className="flex flex-col justify-center items-center gap-4 mb-4 sm:mb-6">
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        <div className="flex flex-col items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMale}
              onChange={(e) => onMaleToggle(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              style={{
                accentColor: "#2563eb",
              }}
            />
            <span className="font-medium text-sm sm:text-base text-blue-600">
              Men WRs
            </span>
            {showMale && (
              <button
                onClick={onToggleMaleSlider}
                className={`text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors ${
                  showMaleSlider ? 'bg-blue-50' : ''
                }`}
                title="Adjust speed factor"
              >
                <WandSparkles size={18}/>
              </button>
            )}
          </label>
          
          {showMale && showMaleSlider && (
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-lg">
              <span className="text-xs text-blue-600 font-medium">Speed:</span>
              <input
                type="range"
                min="20"
                max="100"
                value={maleSpeedFactor}
                onChange={(e) => onMaleSpeedFactorChange(Number(e.target.value))}
                className="w-20 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${maleSpeedFactor}%, #cbd5e1 ${maleSpeedFactor}%, #cbd5e1 100%)`
                }}
              />
              <span className="text-xs text-blue-600 font-medium min-w-[35px]">
                {maleSpeedFactor}%
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFemale}
              onChange={(e) => onFemaleToggle(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              style={{
                accentColor: "#db2777",
              }}
            />
            <span className="font-medium text-sm sm:text-base text-pink-600">
              Women WRs
            </span>
            {showFemale && (
              <button
                onClick={onToggleFemaleSlider}
                className={`text-pink-600 hover:bg-pink-50 p-1 rounded transition-colors ${
                  showFemaleSlider ? 'bg-pink-50' : ''
                }`}
                title="Adjust speed factor"
              >
                <WandSparkles size={18}/>
              </button>
            )}
          </label>
          
          {showFemale && showFemaleSlider && (
            <div className="flex items-center gap-2 px-2 py-1 bg-pink-50 rounded-lg">
              <span className="text-xs text-pink-600 font-medium">Speed:</span>
              <input
                type="range"
                min="20"
                max="100"
                value={femaleSpeedFactor}
                onChange={(e) => onFemaleSpeedFactorChange(Number(e.target.value))}
                className="w-20 h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #db2777 0%, #db2777 ${femaleSpeedFactor}%, #cbd5e1 ${femaleSpeedFactor}%, #cbd5e1 100%)`
                }}
              />
              <span className="text-xs text-pink-600 font-medium min-w-[35px]">
                {femaleSpeedFactor}%
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMyPBs}
              onChange={(e) => onMyPBsToggle(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              style={{
                accentColor: "#16a34a",
              }}
            />
            <span className="font-medium text-sm sm:text-base text-green-600">
              My PBs
            </span>
            {showMyPBs && (
              <button
                onClick={onUpdateMyPBs}
                className='text-green-600 hover:bg-green-50 p-1 rounded transition-colors'
                title="Edit personal bests"
              >
                <Edit size={18}/>
              </button>
            )}
          </label>
        </div>
      </div>
    </div>
    </>
  );
};
