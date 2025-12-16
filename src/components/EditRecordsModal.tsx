import React from 'react';
import type { MyRecords } from '../data/types';
import { worldRecords, distanceLabels, standardDistances } from '../data/worldRecords';

interface EditRecordsModalProps {
  title: string;
  showModal: boolean;
  editingRecords: MyRecords;
  isDark: boolean;
  onClose: () => void;
  onEdit: React.Dispatch<React.SetStateAction<MyRecords>>;
  onSave: (PBs: MyRecords) => void;
}

export const EditRecordsModal: React.FC<EditRecordsModalProps> = ({
  title,
  showModal,
  editingRecords,
  isDark,
  onClose,
  onEdit,
  onSave
}) => {
  if (!showModal) return null;

  // Handle input change
  const onInputChange = (distance: number, value: string): void => {
    onEdit({
      ...editingRecords,
      [distance]: value
    });
  };

  // Save edits
  const onFinish = (): void => {
    onSave(editingRecords);
    onClose();
  };

  // Clear all records
  const onClearAll = (): void => {
    onEdit({});
    onSave({});
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
          isDark ? "bg-gray-800 text-white" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {standardDistances.map((distance) => {
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
                    onInputChange(distance, e.target.value)
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
                onClearAll();
              }
            }}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-red-500 text-white rounded hover:bg-red-600 transition-all"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
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
            onClick={onFinish}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};