import React from 'react';

interface ControlPanelProps {
  showMale: boolean;
  showFemale: boolean;
  showMyPBs: boolean;
  isDark: boolean;
  onMaleToggle: (checked: boolean) => void;
  onFemaleToggle: (checked: boolean) => void;
  onMyPBsToggle: (checked: boolean) => void;
  onUpdateMyPBs: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  showMale,
  showFemale,
  showMyPBs,
  isDark,
  onMaleToggle,
  onFemaleToggle,
  onMyPBsToggle,
  onUpdateMyPBs
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
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
        </label>

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
        </label>

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
        </label>

        {showMyPBs && (
          <button
            onClick={onUpdateMyPBs}
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
  );
};