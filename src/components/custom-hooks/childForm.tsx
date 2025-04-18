import React from 'react';
import { Child, ChildErrors } from '../../utils/types';
import { LuTrash2 } from 'react-icons/lu';
import GenderDropdown from '../ui/GenderDroptown';
import AgeDropdown from '../ui/AgeDropdown';
import TimeSlotDropdown from '../ui/TimeDropdown';

interface ChildFormProps {
  index: number;
  child: Child;
  timeGroup: any;
  onUpdate: (index: number, field: keyof Child, value: any) => void;
  onRemove: (index: number) => void;
  handleTimeSlotChange: (index: number, value: number) => void;
  errors?: ChildErrors;
  slot: any;
  slotChilds:any;
}

const ChildForm: React.FC<ChildFormProps> = ({
  index,
  child,
  timeGroup,
  onUpdate,
  onRemove,
  handleTimeSlotChange,
  slot,
  slotChilds,
  errors = {},
}) => {
  
  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Child {index + 1}</h4>
        {index > 0 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <LuTrash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between space-x-8">
        <div className="w-full">
          <label className="text-xs font-light block mt-4">First Name*</label>
          <input
            type="text"
            placeholder="Enter first name"
            className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
            value={child.firstName}
            onChange={(e) => onUpdate(index, 'firstName', e.target.value)}
          />
          {errors.firstName && (
            <span className="text-red-500 text-xs">{errors.firstName}</span>
          )}
        </div>

        <div className="w-full">
          <label className="text-xs font-light block mt-4">Last Name*</label>
          <input
            type="text"
            placeholder="Enter last name"
            className="text-xs font-light border border-gray-300 px-3 py-3 rounded-lg w-full mt-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={child.lastName}
            onChange={(e) => onUpdate(index, 'lastName', e.target.value)}
          />
          {errors.lastName && (
            <span className="text-red-500 text-xs">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between space-x-8">
        <div className="w-full">
          <label className="text-xs font-light block mt-4">Gender*</label>
          <GenderDropdown
            value={child.gender}
            onChange={(value) => onUpdate(index, 'gender', value)}
          />
        </div>

        <div className="w-full">
          <label className="text-xs font-light block mt-4">Age*</label>
          <AgeDropdown
            value={child.age}
            onChange={(value) => onUpdate(index, 'age', value)}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-light block mt-4">
          Lesson Day & Time*
        </label>
        {timeGroup && (
          <TimeSlotDropdown
            timeGroup={timeGroup}
            handleChange={(data) => handleTimeSlotChange(index, data.value)}
            slot={slot}
            slotChilds={slotChilds}
          />
        )}
        {errors.timeGroupId && (
          <span className="text-red-500 text-xs">{errors.timeGroupId}</span>
        )}
      </div>
    </div>
  );
};

export default ChildForm;