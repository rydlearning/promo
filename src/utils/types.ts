export interface CountryObject {
  name: string;
  iso3: string;
  iso2: string;
  states: StateProps[];
}

interface StateProps {
  name: string;
  state_code: string;
}

export interface ParentListDataProps {
  data1: string;
  data2: string;
  data3: string;
  data4: string;
  data5: string;
  data6: string;
  data7: string;
}


export interface TimeSlot {
  id: number;
  day: number;
  timex: number;
  dayAbbr: string;
  dayText: string;
  timeText: string;
}

export interface FormattedTimeSlot {
  value: number; // Changed to number for array index
  name: string;
  startTime: TimeSlot;
  endTime: TimeSlot;
}

export interface TimeProps {
  className?: string;
  handleChange: (data: FormattedTimeSlot) => void;
  initialValue?: FormattedTimeSlot | null;
  timeGroup: {
    id: number;
    title: string;
    times: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface TimeGroup {
  id: number;
  title: string;
  times: string;
  createdAt: string;
  updatedAt: string;
}

export interface Child {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female';
  timeGroupId: number;
  timeGroupIndex: number;
}

export interface ParentFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  timezone: string;
  survey: string; 
  children: Child[];
}

export interface Country {
  code: string;
  name: string;
}

export interface TimeZone {
  zoneName: string;
}

export interface DialCode {
  dial_code: string;
}

export interface Cohort {
  id: number;
  title: string;
}

export interface TimeSlot {
  value: number;
  label: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  country?: string;
  state?: string;
  phone?: string;
  timezone?: string;
  survey?: string;
  children?: ChildErrors[];
}

export interface ChildErrors {
  firstName?: string;
  lastName?: string;
  cohortId?: string;
  timeGroupId?: string;
}