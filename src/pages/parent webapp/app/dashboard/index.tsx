import Pagination from "../../../../components/ui/Pagination";
import { useEffect, useState } from "react";
import GenderDropdown from "../../../../components/ui/GenderDroptown";
import ParentService from "../../../../services/api/parent.service";
import { toast } from "react-toastify";
import {
  getPPlayerData,
  newFormatDate,
} from "../../../../components/custom-hooks";
import totalStudents from "../../../../assets/icons/totalStudents.svg";
import classesAttended from "../../../../assets/icons/classesAttended.svg";
import classesMixed from "../../../../assets/icons/classesMixed.svg";
import activeCohorts from "../../../../assets/icons/activeCohorts.svg";
import AgeDropdown from "../../../../components/ui/AgeDropdown";
import TimeDropdown from "../../../../components/ui/TimeDropdown";
import { FormattedTimeSlot } from "../../../../utils/types";

const headingData = ["First Name", "Last Name", "Age", "Reg. Status", "Action"];

const ParentDashboard = () => {
  // const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [check, setCheck] = useState<boolean>(false);
  const itemsPerPage = 7;
  const parentService = new ParentService();
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    age: 0,
    gender: "male",
  };

  type Item = {
    key: string;
    value: any;
  };

  interface KidsRegisteredCount {
    [key: string]: number;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [children, setChildren] = useState<any>([]);
  const [formData, setFormData] = useState(initialValues);
  const [timeGroup, setTimeGroup] = useState(null);
  const [timeGroupId, setTimeGroupId] = useState(null);
  const [timeGroupIndex, setTimeGroupIndex] = useState(null);
  const [slot, setSlot] = useState("");
  const [slotChilds, setSlotChilds] = useState<KidsRegisteredCount | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const parent = getPPlayerData();

  const getDashboardData = async () => {
    const response = await parentService.getParentDashboardData();
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    setChildren(response.data.children);
    setData(response.data);
  };

  const getTimeTable = async (timezone:any) => {
    const response = await parentService.getTimetable(timezone);
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    setTimeGroup(response.data.timeTable);
    setTimeGroupId(response.data.timeTable.id);
    setSlot(response.data.slot);
    setSlotChilds(response.data.slotChilds);
  };

  useEffect(() => {
    getDashboardData();
    getTimeTable(parent.parent.timezone);
  }, []);

  // useEffect(() => {
  //   getTimeTable(parent.parent.timezone);
  // }, []);

  console.log(parent)

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      timeGroupIndex === null ||
      !timeGroupId ||
      !formData.age ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.gender
    ) {
      toast.error("All input field is required!");
    } else {
      handleAddChild();
    }
  };

  // const validateSlot = () => {
  //   let isValid = true;

  //   const parsedSlot = JSON.parse(slot);
  //   const allowedIndexConfig = parsedSlot.find(
  //     (config: any) => config.index === timeGroupIndex
  //   );

  //   if (!allowedIndexConfig) {
  //     toast.error(`Select a time slot and try again`);
  //     isValid = false;
  //   }

  //   const currentKidsCount = slotChilds?.[timeGroupIndex || 0] ?? 0;

  //   if (currentKidsCount >= allowedIndexConfig.numberOfKid) {
  //     isValid = false;
  //   }

  //   return isValid;
  // };

  const handleAddChild = async () => {
    setLoading(true);
    // const checkSlot = await validateSlot();
    try {
      // if (checkSlot) {
      const response = await parentService.addChild(formData);
      setLoading(false);
      if (!response.status) {
        toast.error(response.message);
        return;
      } else {
        handleAddProgram(response?.data.id);
      }
      // } else {
      //   toast.error(
      //     `Maximum number of registration reached for the time slot selected`
      //   );
      // }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.mesage);
    }

    // return false;
  };

  const handleAddProgram = async (childId: any) => {
    const timeOffset = 1;
    const payload = {
      timeOffset,
      level: 1,
      timeGroupId: Number(timeGroupId),
      timeGroupIndex: Number(timeGroupIndex),
    };
    try {
      const response = await parentService.addProgram(
        payload,
        childId,
        parent?.promoData.id
      );

      if (!response.status) {
        toast.error(response.message);
        return;
      }
      toast.success("Child added successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const parentKeyMetrics = [
    {
      icon: totalStudents,
      info: "All Program",
      value: data.allPrograms ? data.allPrograms : 0,
    },
    {
      icon: classesAttended,
      info: "Total Child Enrolled",
      value: data.totalChild ? data.totalChild : 0,
    },
    {
      icon: classesMixed,
      info: "Ongoing Class",
      value: data.allOngoingClass ? data.allOngoingClass : 0,
    },
    {
      icon: activeCohorts,
      info: "Completed Programs",
      value: data.completedPrograms ? data.completedPrograms : 0,
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = children?.slice(indexOfFirstItem, indexOfLastItem);

  const handleTimeSlotChange = (selected: any) => {
    setTimeGroupIndex(selected.value);
  };

  return (
    <section className="my-20 mx-32">
      <div className="flex items-center justify-between text-xs">
        <p className="text-[#344054] text-base font-light">
          Welcome, {parent.parent.firstName + " " + parent.parent.lastName} ({" "}
          {parent.promoData.title} )!
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleClick}
            className="text-white bg-[#0B1B2B] rounded-md py-2 px-8"
          >
            Add Child
          </button>

          <button
            onClick={() => {
              //clear session
              if (confirm("Do you really want to logout ?")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-white bg-[red] rounded-md py-2 px-8"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-10">
        <p>Key Metrics and Information</p>
        <ul className="mt-5 flex items-center justify-between">
          {parentKeyMetrics.map((metric, i) => {
            return (
              <li key={i} className="flex items-center space-x-3">
                <img src={metric.icon} alt={metric.info} />
                <div>
                  <p className="text-[#5E5E5E] text-xs">{metric.info}</p>
                  <p className="text-[#202020] text-lg  mt-1 ">
                    {metric.value}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-12">
        {/* table  */}
        <div className="mt-12">
          <div className=" border rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="px-5 py-5 border-b">
                  {headingData.map((heading: any, i: number) => {
                    return (
                      <th
                        key={i}
                        className="px-5 py-4 text-sm text-left text-gray-800 font-medium capitalize bg-[#F9F9F9]  border-gray-200"
                      >
                        {heading}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {currentItems.map((data: any, i: number) => {
                  return (
                    <tr key={i} className="">
                      <td className="px-5 py-5 font-light text-sm  bg-white border-b border-gray-200">
                        {data.firstName}
                      </td>
                      <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                        {data.lastName}
                      </td>
                      <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                        {data.age}
                      </td>
                      <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                        {data.status ? "Completed" : "Pending"}
                      </td>
                      <td className="px-5 py-5 font-light text-xs border-b border-gray-200 text-[#1671D9] ">
                        <a href="http://google.com" target="blank">
                          Go to Class
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={headingData.length}
                    className="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                    <Pagination
                      totalItems={children.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      paginate={paginate}
                      title="Children"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-40"
          onClick={closeModal}
        ></div>
      )}

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full  bg-white z-50 transform transition-transform duration-300 ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-black font-bold"
          onClick={closeModal}
        >
          X
        </button>

        {/* Modal Content */}
        <section className="my-20 mx-16 w-[346px]">
          <h3 className="text-2xl font-semibold mt-8">Register Child</h3>
          <p className="font-light mt-2">
            Fill the form below to register your child
          </p>
          <form
            onSubmit={handleSubmit}
            className={`transition-opacity duration-300 opacity-100"}`}
          >
            <div className="flex items-center justify-between space-x-8">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="text-xs font-light block mt-4"
                >
                  First Name*
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                  onChange={(e: any) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="text-xs font-light block mt-4"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="text-xs font-light border border-[#DADCE0] px-3 py-3 rounded-lg w-full mt-3"
                  onChange={(e: any) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between space-x-8">
              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="text-xs font-light block mt-4"
                >
                  Gender*
                </label>
                <GenderDropdown
                  value="male"
                  onChange={(e: any) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="childAge"
                  className="text-xs font-light block mt-4"
                >
                  Child Age*
                </label>
                <AgeDropdown
                  value={7}
                  onChange={(v: any) => setFormData({ ...formData, age: v })}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="lessonDay"
                className="text-xs font-light block mt-4"
              >
                Lesson Day & Time*
              </label>
              {timeGroup ? (
                <TimeDropdown
                  handleChange={handleTimeSlotChange}
                  timeGroup={timeGroup}
                  slot={slot}
                  slotChilds={slotChilds}
                />
              ) : null}
            </div>

            <div className="w-full flex items-center justify-between space-x-5 mt-24">
              <button
                onClick={closeModal}
                className="w-full bg-white border border-[#202020] rounded-lg text-sm py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" w-full bg-[#202020] text-sm rounded-lg text-white py-3"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </section>
  );
};

export default ParentDashboard;
