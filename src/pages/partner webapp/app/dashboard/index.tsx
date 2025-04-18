import AppLayout from "../../../../components/layouts/AppLayout";
import copy from "../../../../assets/icons/Copy.svg";
import Pagination from "../../../../components/ui/Pagination";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  getPlayerData,
  newFormatDate,
} from "../../../../components/custom-hooks";
import totalStudents from "../../../../assets/icons/totalStudents.svg";
import inactiveStudents from "../../../../assets/icons/inactiveStudents.svg";
import activeStudents from "../../../../assets/icons/activeStudents.svg";
import webBaseUrl from "../../../../hook/WebNetwork";
import { Link } from "react-router-dom";
import PromoService from "../../../../services/api/promo.service";

const Dashboard = () => {
  const headingData = ["#", "Parent Name", "Child Name", "Country", "Gender"];
  const promoService = new PromoService();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [programData, setProgramData] = useState([]);
  const [data, setData] = useState<any>([]);
  const itemsPerPage = 10;
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const promo = getPlayerData();

  const getPrograms = async () => {
    const response = await promoService.allPromoPrograms();
    if (!response.status) {
      toast.error(response.message);
      return;
    }

    const cd = response.data.programs;

    setProgramData(cd);
    setData(response.data);
  };

  useEffect(() => {
    getPrograms();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const keyMetrics = [
    {
      icon: totalStudents,
      info: "Total Students Enrolled",
      value: data.totalStudent ? data.totalStudent : 0,
    },
    {
      icon: activeStudents,
      info: "Active Enrolled  Students",
      value: data.activeStudent ? data.activeStudent : 0,
    },
    {
      icon: inactiveStudents,
      info: "Inactive Students",
      value: data.inActiveStudent ? data.inActiveStudent : 0,
    },
  ];

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand("copy");
    }
    toast.success("Promo link copied successfully!");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programData?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AppLayout>
      <section className="mt-10">
        <div className="flex items-center justify-between text-xs">
          <p className="text-[#344054] text-base font-light">
            Welcome, {promo.firstName + " " + promo.lastName}!
          </p>
        </div>
        <div className="mt-10">
          <p>Key Metrics and Information</p>
          <ul className="mt-7 flex items-center justify-between">
            {keyMetrics.map((metric, i) => {
              return (
                <li key={i} className="flex items-center space-x-3">
                  <img src={metric.icon} alt={metric.info} />
                  <div>
                    <p className="text-[#5E5E5E] text-xs">{metric.info}</p>
                    <p className="text-[#202020] text-lg font-medium mt-1">
                      {metric.value}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex justify-between items-center mt-16">
          <div>
            <p className="text-xl font-medium">Programs List</p>
            <p className="mt-2 font-light text-[#5E5E5E] text-sm">
              A list of all programs
            </p>
          </div>

          {/*<div className="flex items-center space-x-2">*/}
          {/*  <p className="font-light"></p>*/}
          {/*  <img src={rightArrow} alt="" />*/}
          {/*</div>*/}
        </div>

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

              <tbody className="bg-white">
                {currentItems.length > 0 ? (
                  <>
                    {currentItems.map((p: any, i: number) => {
                      return (
                        <tr key={i} className="bg-white ">
                          <td className="px-5 py-5 font-light text-sm  bg-white border-b border-gray-200">
                            {i + 1}
                          </td>
                          <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                            {p?.child.parent.firstName +
                              " " +
                              p?.child.parent.lastName}
                          </td>
                          <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                            {p?.child.firstName + " " + p?.child.lastName}
                          </td>
                          <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                            {p?.child.parent.country}
                          </td>
                          <td className="px-5 py-5 font-light text-sm bg-white border-b border-gray-200">
                            {p?.child.gender}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <span className="px-6 py-5  border-b border-gray-200 cursor-pointer ">
                    <button className="text-sm text-[red] my-5">
                      No Programs yet
                    </button>
                  </span>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={headingData.length}
                    className="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                    <Pagination
                      totalItems={programData.length}
                      itemsPerPage={10}
                      currentPage={currentPage}
                      paginate={paginate}
                      title="Cohorts"
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="mt-16">
          <p>promo Link</p>
          <form className="mt-3">
            <div className="inline relative">
              <input
                type="text"
                readOnly
                ref={inputRef}
                value={`${webBaseUrl()}/promo/parent/register?promoID=${
                  promo ? promo.id + 100 : ""
                }`}
                className="text-[#000] placeholder:text-[#000] border-[0.5px] border-[#000] rounded-md mr-2 px-2 w-[500px] text-xs py-2"
              />
              <img
                src={copy}
                alt="copy"
                className="absolute right-3 top-[0.1px] cursor-pointer"
                onClick={handleCopy}
              />
            </div>
            <button className="text-[#0B1B2B] text-xs bg-white rounded-md border border-[#0B1B2B] py-2 px-3 ">
              Disable Link
            </button>
          </form>
        </div>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
