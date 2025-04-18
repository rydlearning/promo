import React, { useState, useEffect } from "react";
import AuthService from "../../../services/api/auth.service";
import ParentService from "../../../services/api/parent.service";
import {
  useGetCountries,
  useGetDialCodes,
  useGetTimezones,
} from "../../../services/query/useThirdParty";
import {
  Child,
  ParentFormData,
  FormErrors,
  Cohort,
  TimeSlot,
  TimeGroup,
  CountryObject,
} from "../../../utils/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { LuEye, LuEyeOff, LuPlusCircle } from "react-icons/lu";
import ChildForm from "../../../components/custom-hooks/childForm";
import logo from "../../../assets/images/logo.svg";

const initialChildState: Child = {
  firstName: "",
  lastName: "",
  age: 5,
  gender: "male",
  timeGroupId: 0,
  timeGroupIndex: 0,
};

const initialFormData: ParentFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  timezone: "",
  survey: "",
  children: [{ ...initialChildState }],
};

interface KidsRegisteredCount {
  [key: string]: number;
}

const SignUpParent: React.FC = () => {
  const navigate = useNavigate();
  const authService = new AuthService();
  const parentService = new ParentService();
  const [searchParam] = useSearchParams();
  const promoID = searchParam.get("promoID");

  // Form states
  const [formData, setFormData] = useState<ParentFormData>(initialFormData);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [timeGroup, setTimeGroup] = useState<TimeGroup | null>(null);
  const [slot, setSlot] = useState("");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [dialCode, setDialCode] = useState<string | null>(null);
  const [promoId, setPromoId] = useState<number | null>(null);
  const [additionalFieldValues, setAdditionalFieldValues] = useState({});
  const [fieldValue, setFieldlValue] = useState({});
  const [countryObject, setCountryObject] = useState<CountryObject | null>(
    null
  );
  const [slotChilds, setSlotChilds] = useState<KidsRegisteredCount | null>(
    null
  );
  const [additionalFields, setadditionalFields] = useState([]);

  // API data
  const { data: fetchedCountries } = useGetCountries();
  const { data: fetchedTimezones } = useGetTimezones(countryCode);
  const { data: fetchedDialCodes } = useGetDialCodes();

  const countriesData = fetchedCountries?.data.data || [];
  const timeZonesArray = fetchedTimezones?.data.zones || [];
  const dialCodesArray = fetchedDialCodes?.data.data || [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    const selectedCountryObject = countriesData.find(
      (country: any) => country.name === countryName
    );
    const dialCodeObject = dialCodesArray.find(
      (d: any) => d.name === countryName
    );
    setCountryObject(selectedCountryObject);
    setCountryCode(selectedCountryObject.iso2);
    setCountry(countryName);
    setDialCode(dialCodeObject?.dial_code);
  };

  useEffect(() => {
    if (promoID) {
      setPromoId(parseInt(promoID, 10) - 100);
    } else {
      toast.error("Invalid promo ID");
    }
  }, [promoID]);

  useEffect(() => {
    if (promoId) {
      getAdditionalFields(promoId);
    }
  }, [promoId]);


  useEffect(() => {
    if (promoId && formData.timezone) {
      getTimeTable(promoId,formData.timezone);
    }
  }, [formData.timezone]);

  const getTimeTable = async (id: any,timezone:string): Promise<void> => {
    const response = await parentService.getTimetableWithId(id,timezone);
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    setTimeGroup(response.data.timeTable);
    setSlot(response.data.slot);
    setSlotChilds(response.data.slotChilds);
  };

  const getAdditionalFields = async (id: any): Promise<void> => {
    const response = await parentService.getAdditionalField(id);
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    
    const data = Array.isArray(response.data)
    ? response.data
    : JSON.parse(response.data);
    
    setadditionalFields(data);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Parent validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!country) newErrors.country = "Country is required";
    if (!state) newErrors.state = "State is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.survey) newErrors.survey = "Select where you hear about us";
    if (!formData.timezone) newErrors.timezone = "Timezone is required";
    if (formData.password !== confirmPassword)
      newErrors.password = "Both password does not match";

    // Children validation
    const childrenErrors = formData.children.map((child) => {
      const childError: Record<string, string> = {};
      if (!child.firstName) childError.firstName = "First name is required";
      if (!child.lastName) childError.lastName = "Last name is required";
      // if (!child.timeGroupId) childError.timeGroupId = "Time group is required";
      return childError;
    });

    if (childrenErrors.some((error) => Object.keys(error).length > 0)) {
      newErrors.children = childrenErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChildUpdate = (
    index: number,
    field: keyof Child,
    value: any
  ): void => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      children: newChildren,
    }));
  };

  const handleTimeSlotChange = (index: number, value: number) => {
    const newChildren = [...formData.children];
    newChildren[index] = {
      ...newChildren[index],
      timeGroupId: timeGroup?.id || 0,
      timeGroupIndex: value,
    };
    setFormData((prev) => ({
      ...prev,
      children: newChildren,
    }));
  };

  const addChild = (): void => {
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, { ...initialChildState }],
    }));
  };

  const removeChild = (index: number): void => {
    if (formData.children.length > 1) {
      setFormData((prev) => ({
        ...prev,
        children: prev.children.filter((_, i) => i !== index),
      }));
    }
  };

  // const validateSlot = () => {
  //   let isValid = true;

  //   for (const child of formData.children) {
  //     const parsedSlot = JSON.parse(slot);
  //     const allowedIndexConfig = parsedSlot.find(
  //       (config: any) => config.index === child.timeGroupIndex
  //     );

  //     if (!allowedIndexConfig) {
  //       toast.error(`Select a time slot and try again`);
  //       isValid = false;
  //       break;
  //     }

  //     const currentKidsCount = slotChilds?.[child.timeGroupIndex] ?? 0;

  //     if (currentKidsCount >= allowedIndexConfig.numberOfKid) {
  //       isValid = false;
  //       break;
  //     }
  //   }

  //   return isValid;
  // };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const parentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        timezone: formData.timezone,
        survey: formData.survey,
        additionalFields: additionalFieldValues,
        state,
        country,
        promoId,
      };

      // const checkSlot = validateSlot();
      // if (checkSlot) {
        const response = await authService.parentSignUp(parentData);
        if (!response.status) {
          toast.error(response.message);
          return;
        }

        // Register children
        if (response.status) {
          for (const child of formData.children) {
            await registerChild(child, response.data.id);
          }
        }

        toast.success("Registration successful!");
        navigate("/promo/parent/login");
      // } else {
      //   toast.error(
      //     `Maximum number of registration reached for the time slot selected`
      //   );
      // }
    } catch (err) {
      console.log(err);
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const registerChild = async (childData: Child, id: number): Promise<void> => {
    try {
      const response = await parentService.addChildWithId(
        {
          firstName: childData.firstName,
          lastName: childData.lastName,
          age: childData.age,
          gender: childData.gender,
        },
        id
      );

      if (response.status) {
        await handleAddProgram(
          response.data.id,
          childData,
          response.data.parentId
        );
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.log(err);
      throw new Error((err as Error).message);
    }
  };

  const handleAddProgram = async (
    childId: string,
    childData: Child,
    id: number
  ): Promise<void> => {
    const payload = {
      timeOffset: 1,
      level: 1,
      timeGroupId: childData.timeGroupId,
      timeGroupIndex: childData.timeGroupIndex,
    };

    await parentService.addProgramWithId(
      payload,
      Number(childId),
      promoId!,
      id
    );
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    const newValues = {
      ...fieldValue,
      [fieldId]: value,
    };
    setFieldlValue(newValues);
    setAdditionalFieldValues(newValues);
  };

  return (
    <section className="mx-auto w-[90%] lg:w-[50%] max-w-[604px] my-12">
      <img src={logo} alt="logo" width={150} />
      <h3 className="text-2xl font-semibold mt-8">Join us today</h3>
      <p className="font-light mt-2">
        Create your account and register your children
      </p>

      <form onSubmit={handleSubmit}>
        <p className="font-medium text-lg mt-8 text-[#88167A]">
          Parent Information
        </p>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-xs font-light block mt-4">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs">{errors.firstName}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-light block mt-4">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-light block mt-4">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="about" className="text-xs font-light block mt-4">
              How do you hear about us ?
            </label>
            <select
              id="survey"
              name="survey"
              value={formData.survey}
              onChange={handleInputChange}
              className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
            >
              <option value="" label="-- Select option --" />
              <option value="Google" label="Google" />
              <option value="Group Chats" label="Group Chats" />
              <option value="Friends" label="Friends" />
              <option value="Social Media" label="Social Media" />
              <option value="Others" label="Others" />
            </select>
            {errors.survey && (
              <span className="text-red-500 text-xs">{errors.survey}</span>
            )}
          </div>
          {additionalFields.map((each: any, i) => (
            <div key={i}>
              <label className="text-xs font-light block mt-4">
                {each.label}
              </label>
              <input
                type={each.type}
                name={each.type}
                required={each.required}
                onChange={(e) => handleFieldChange(each.id, e.target.value)}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                placeholder={"Enter " + each.label}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
          ))}

          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="country"
                className="text-xs font-light block mt-4"
              >
                Country
              </label>
              <select
                id="country"
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                onChange={handleCountryChange}
              >
                <option value="" label="Select country" />
                {countriesData.map((country: any, i: number) => {
                  return (
                    <option key={i} value={country?.name}>
                      {country?.name}
                    </option>
                  );
                })}
              </select>
              {errors.country && (
                <span className="text-red-500 text-xs">{errors.country}</span>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="state" className="text-xs font-light block mt-4">
                Province/State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
              >
                <option value="" label="Select province/state" />
                {countryObject?.states.map((state: any) => (
                  <option key={state.state_code} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <span className="text-red-500 text-xs">{errors.state}</span>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-xs font-light block mt-4">Phone</label>
              <div className="flex">
                <div className="mr-2 mt-5">{dialCode}</div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && (
                <span className="text-red-500 text-xs">{errors.phone}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="text-xs font-light block mt-4">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
              >
                <option value="">Select Timezone</option>
                {timeZonesArray.map((zone: any) => (
                  <option key={zone.zoneName} value={zone.zoneName}>
                    {zone.zoneName}
                  </option>
                ))}
              </select>
              {errors.timezone && (
                <span className="text-red-500 text-xs">{errors.timezone}</span>
              )}
            </div>
          </div>
          <div className=" my-8 ">
            <p className="font-medium text-lg text-[#88167A]">Create profile</p>
            <span className="text-red-500 font-small text-sm">
              Profile need to be created to access class *
            </span>
          </div>
          <div className="relative">
            <label className="text-xs font-light block mt-4">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <LuEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <LuEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-light block mt-4">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <LuEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <LuEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password}</span>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-8">
            <p className=" text-[#88167A] font-medium text-lg">
              Children Information
            </p>
          </div>
          {formData.children.map((child, index) => (
            <>
              <ChildForm
                key={index}
                index={index}
                child={child}
                timeGroup={timeGroup}
                slot={slot}
                slotChilds={slotChilds}
                onUpdate={handleChildUpdate}
                onRemove={removeChild}
                handleTimeSlotChange={handleTimeSlotChange}
                errors={errors.children?.[index]}
              />
            </>
          ))}
          <button
            type="button"
            onClick={addChild}
            className="flex items-center btn hover:text-[#CFA2CA] mb-3 text-sm text-white bg-[#88167A] rounded-md py-2 px-3"
          >
            <LuPlusCircle className="w-5 h-5 mr-2" />
            Add Another Child
          </button>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-md py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Processing..." : "Complete Registration"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignUpParent;
