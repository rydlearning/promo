import React from 'react';

interface AgeDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

const AgeDropdown: React.FC<AgeDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      className="text-xs font-light border border-gray-300 px-3 py-3 rounded-lg w-full mt-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {Array.from({ length: 12 }, (_, i) => i + 5).map((age) => (
        <option key={age} value={age}>
          {age} years
        </option>
      ))}
    </select>
  );
};

export default AgeDropdown;