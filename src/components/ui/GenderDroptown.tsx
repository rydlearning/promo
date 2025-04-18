import React from 'react';

interface GenderDropdownProps {
  value: 'male' | 'female';
  onChange: (value: 'male' | 'female') => void;
}

const GenderDropdown: React.FC<GenderDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      className="text-xs font-light border border-gray-300 px-3 py-3 rounded-lg w-full mt-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value as 'male' | 'female')}
    >
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  );
};

export default GenderDropdown;