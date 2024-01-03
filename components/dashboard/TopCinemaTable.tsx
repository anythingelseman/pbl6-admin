import apiClient from "@/services/apiClient";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

interface Cinema {
  id: number;
  name: string;
  city: string;
  totalRevenue: number;
  numberOfTickets: number;
}

export const TopCinemaTable = () => {
  const [topCinemas, setTopCinemas] = useState<Cinema[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/statistics/cinema?TimeOption=3`);
        const data = response.data;
        setTopCinemas(data.data as Cinema[]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Cinemas
      </h4>

      {isLoading && (
        <div className="p-10">
          <Spinner />
        </div>
      )}

      {!isLoading && topCinemas && (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                City
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Revenue
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tickets
              </h5>
            </div>
          </div>

          {topCinemas.map((cinema, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-4 text-sm ${
                index === topCinemas.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={cinema.id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {cinema.name}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{cinema.city}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(cinema.totalRevenue)}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">
                  {cinema.numberOfTickets}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
