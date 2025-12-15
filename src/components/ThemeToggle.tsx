import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDark}
        onChange={onToggle}
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
  );
};