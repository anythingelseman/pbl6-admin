"use client";
import { CardDataStats } from "@/components/dashboard/CardDataStats";
import ChartOne from "@/components/dashboard/ChartOne";
import { ChartRevenue } from "@/components/dashboard/ChartRevenue";
import ChartThree from "@/components/dashboard/ChartThree";
import ChartTwo from "@/components/dashboard/ChartTwo";
import { TopCinemaTable } from "@/components/dashboard/TopCinemaTable";
import { TopFilmTable } from "@/components/dashboard/TopFilmTable";
import apiClient from "@/services/apiClient";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { IoTicketOutline } from "react-icons/io5";
import { HiMiniCurrencyDollar } from "react-icons/hi2";

interface Overview {
  currPrdTotalRevenue: number;
  currPrdTotalBookings: number;
  currPrdTotalTickets: number;
  currPrdOccupancyRate: number;
  currPrdSchedules: number;
  prevPrdTotalRevenue: number;
  prevPrdTotalBookings: number;
  prevPrdTotalTickets: number;
  prevPrdOccupancyRate: number;
  prevPrdSchedules: number;
}

export default function DashBoard() {
  const [cinemas, setCinemas] = useState<any[]>();
  const [overview, setOverview] = useState<Overview>();
  const [timeScale, setTimeScale] = useState<number>(2);
  const [cinema, setCinema] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/statistics/overview`, {
          params: {
            TimeOption: timeScale,
            CinemaId: cinema !== -1 ? cinema : undefined,
          },
        });
        const data = response.data;
        setOverview(data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [timeScale, cinema]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/cinema`);
        const data = response.data;
        setCinemas(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  console.log(cinemas);

  return (
    <div className="p-14">
      <div className="flex mb-8 gap-10 justify-end">
        <div className="flex gap-2 items-center">
          <select
            onChange={(e) => setTimeScale(Number(e.target.value))}
            value={timeScale}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={0}>Hàng ngày</option>
            <option value={1}>Hàng tuần</option>
            <option value={2}>Hàng tháng</option>
            <option value={3}>Hàng năm</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Rạp
          </label>
          <select
            onChange={(e) => setCinema(Number(e.target.value))}
            value={cinema}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={-1}>Tất cả rạp</option>
            {cinemas &&
              cinemas.map((cinema) => {
                return (
                  <option key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>

      {!isLoading && overview ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <CardDataStats
            title="Tổng doanh thu"
            total={`${overview.currPrdTotalRevenue}`}
            rate={
              overview.prevPrdTotalRevenue
                ? `${Math.abs(
                    (overview.currPrdTotalRevenue -
                      overview.prevPrdTotalRevenue) /
                      Math.max(1, overview.prevPrdTotalRevenue),
                  ).toFixed(2)}%`
                : ""
            }
            levelUp={
              overview.currPrdTotalRevenue - overview.prevPrdTotalRevenue > 0
            }
            levelDown={
              overview.currPrdTotalRevenue - overview.prevPrdTotalRevenue < 0
            }
          >
            <HiMiniCurrencyDollar className="text-xl text-blue-500" />{" "}
          </CardDataStats>
          <CardDataStats
            title="Tổng số vé"
            total={`${overview.currPrdTotalTickets}`}
            rate={
              overview.prevPrdTotalTickets
                ? `${Math.abs(
                    (overview.currPrdTotalTickets -
                      overview.prevPrdTotalTickets) /
                      Math.max(1, overview.prevPrdTotalRevenue),
                  ).toFixed(2)}%`
                : ""
            }
            levelUp={
              overview.currPrdTotalTickets - overview.prevPrdTotalTickets > 0
            }
            levelDown={
              overview.currPrdTotalTickets - overview.prevPrdTotalTickets < 0
            }
          >
            <IoTicketOutline className="text-xl text-blue-500" />
          </CardDataStats>
          <CardDataStats
            title="Tổng lượt đặt"
            total={`${overview.currPrdTotalBookings}`}
            rate={
              overview.prevPrdTotalBookings
                ? `${Math.abs(
                    (overview.currPrdTotalBookings -
                      overview.prevPrdTotalBookings) /
                      Math.max(1, overview.prevPrdTotalBookings),
                  ).toFixed(2)}%`
                : ""
            }
            levelUp={
              overview.currPrdTotalBookings - overview.prevPrdTotalBookings > 0
            }
            levelDown={
              overview.currPrdTotalBookings - overview.prevPrdTotalBookings < 0
            }
          >
            <svg
              className="fill-[#3c50e0] dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                fill=""
              />
              <path
                d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                fill=""
              />
            </svg>
          </CardDataStats>
          <CardDataStats
            title="Số lịch chiếu"
            total={`${overview.currPrdSchedules}`}
            rate={
              overview.prevPrdSchedules
                ? `${Math.abs(
                    (overview.currPrdSchedules - overview.prevPrdSchedules) /
                      Math.max(1, overview.prevPrdSchedules),
                  ).toFixed(2)}%`
                : ""
            }
            levelUp={overview.currPrdSchedules - overview.prevPrdSchedules > 0}
            levelDown={
              overview.currPrdSchedules - overview.prevPrdSchedules < 0
            }
          >
            <svg
              className="fill-[#3c50e0] dark:fill-white"
              width="22"
              height="18"
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
                fill=""
              />
              <path
                d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
                fill=""
              />
              <path
                d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
                fill=""
              />
            </svg>
          </CardDataStats>
        </div>
      ) : (
        <div className="p-20 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne timeOption={timeScale} cinemaId={cinema} />
        <ChartThree timeOption={timeScale} cinemaId={cinema} />
        <ChartRevenue timeOption={timeScale} cinemaId={cinema} />
      </div>

      <div className="flex gap-4 mt-10">
        <div className="flex-[3]">
          <TopFilmTable timeOption={timeScale} cinemaId={cinema} />
        </div>

        <div className="flex-[2]">
          <TopCinemaTable timeOption={timeScale} />
        </div>
      </div>
    </div>
  );
}
