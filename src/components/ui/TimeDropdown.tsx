import { useRef, useState, useEffect } from 'react';
import { useOnClickOutside } from '../../components/custom-hooks';

interface SingleTimeSlot {
  id: number;
  day: number;
  timex: number;
  dayAbbr: string;
  dayText: string;
  timeText: string;
}

interface OldTimeSlot {
  day: number;
  dayText: string;
  timeText: string;
}

interface TimeGroup {
  id: number;
  title: string;
  times: string;
  createdAt: string;
  updatedAt: string;
  slot: any;
  slotChilds:any;
}

interface FormattedTimeSlot {
  value: number;
  name: string;
}

interface TimeProps {
  handleChange: (data: FormattedTimeSlot) => void;
  initialValue?: FormattedTimeSlot;
  timeGroup?: TimeGroup;
  className?: string;
  slotChilds?: any;
  slot?: any;
}

  
interface TimeSlot {
  id: number;
  dayText: string;
  dayAbbr: string;
  day: number;
  timex: number;
  timeText: string;
}

interface SlotConfig {
  index: number;
  numberOfKid: number;
}

interface SlotChilds {
  [key: number]: number;
}

type TimeSlotsData = TimeSlot[][];

export default function TimeSlotDropdown({ handleChange, initialValue, slotChilds, slot, timeGroup, className }: TimeProps) {
  const [toggle, setToggle] = useState(false);
  const [value, setValue] = useState<string | null>(initialValue?.name || null);
  const [formattedData, setFormattedData] = useState<FormattedTimeSlot[]>([]);
  const dropdownRef = useRef(null);

  const [filteredTimes, setFilteredTimes] = useState<string | null>(null);

  const validateSlot = (slot: string, slotChilds: SlotChilds): number[] => {
    const parsedSlot = Array.isArray(slot)
    ? slot  as SlotConfig[]
    : JSON.parse(slot) as SlotConfig[];
    
    return Object.entries(slotChilds).reduce<number[]>((acc, [index, count]) => {
      const config = parsedSlot.find(item => item.index === parseInt(index));
      if (config && count >= config.numberOfKid) {
        acc.push(parseInt(index));
      }
      return acc;
    }, []);
  };

  const filterTimeSlots = (times: any, invalidIndices: number[]): string => {
    // const parsedTimes = JSON.parse(times) as TimeSlotsData;
    return JSON.stringify(
      times.filter((_:any, index:any) => !invalidIndices.includes(index))
    );
  };

  useEffect(() => {
    if(timeGroup){
      try {
        console.log("in")
        const invalidIndices = validateSlot(slot, slotChilds);
        
        const filtered = filterTimeSlots(timeGroup.times, invalidIndices);
        setFilteredTimes(filtered);
      } catch (error) {
        console.error('Error processing slot data:', error);
        setFilteredTimes(null);
      }
    }
  }, [timeGroup]);

  useEffect(() => {
    if (filteredTimes) {
      try {
        console.log(filteredTimes)
        const parsedTimeSlots = Array.isArray(filteredTimes)
        ? filteredTimes
        : JSON.parse(filteredTimes);

        let formatted: FormattedTimeSlot[] = [];

        if (Array.isArray(parsedTimeSlots[0]) && Array.isArray(parsedTimeSlots)) {
          formatted = parsedTimeSlots.map((slotPair: OldTimeSlot[], index: number) => {
            const [start, end] = slotPair;
            return {
              value: index,
              name: `${start.dayText} ${start.timeText}, ${end.dayText} ${end.timeText}`,
            };
          });
        } 

        else if (Array.isArray(parsedTimeSlots)) {
          formatted = parsedTimeSlots.map((slot: SingleTimeSlot) => ({
            value: slot.id,
            name: `${slot.dayText} ${slot.timeText}`,
          }));
        }

        setFormattedData(formatted);
      } catch (error) {
        console.error('Error parsing time slots:', error);
        setFormattedData([]);
      }
    }
  }, [filteredTimes]);

  const closeModal = () => {
    setToggle(false);
  };

  useOnClickOutside(dropdownRef, closeModal);

  const handleSelectChange = (data: FormattedTimeSlot) => {
    setValue(data.name);
    handleChange(data);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3 cursor-pointer ${className || ''}`}
        onClick={() => setToggle(prevState => !prevState)}
      >
        {value || '--- Select Time Slot ---'}
      </div>
      {toggle && (
        <div className="h-fit max-h-60 z-20 overflow-y-auto absolute top-14 w-full shadow bg-white text-[14px]">
          {formattedData.length > 0 ? (
            formattedData.map((item) => (
              <div
                key={item.value}
                className="hover:bg-gray-100 px-4 py-2 hover:cursor-pointer"
                onClick={() => {
                  setToggle(false);
                  handleSelectChange(item);
                }}
              >
                {item.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No time slots available</div>
          )}
        </div>
      )}
    </div>
  );
}