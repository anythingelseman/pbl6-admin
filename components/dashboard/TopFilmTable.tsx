import apiClient from "@/services/apiClient";
import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";

interface Film {
  id: number;
  name: string;
  duration: number;
  category: string;
  numberOfVotes: number;
  score: number;
  totalRevenue: number;
  numberOfTickets: number;
}

export const TopFilmTable = ({
  timeOption,
  cinemaId,
}: {
  timeOption: number;
  cinemaId: number;
}) => {
  const [topFilms, setTopFilms] = useState<Film[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/statistics/film`, {
          params: {
            TimeOption: timeOption,
            CinemaId: cinemaId !== -1 ? cinemaId : undefined,
          },
        });
        const data = response.data;
        setTopFilms(data.data as Film[]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [timeOption, cinemaId]);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Phim
      </h4>

      {isLoading && (
        <div className="p-10">
          <Spinner />
        </div>
      )}

      {!isLoading && topFilms && (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tên
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Thể loại
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Doanh thu
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Số vé
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Điểm
              </h5>
            </div>
          </div>

          {topFilms.map((film, index) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 text-sm ${
                index === topFilms.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={film.id}
            >
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">
                  {film.name}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{film.category}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(film.totalRevenue)}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">
                  {film.numberOfTickets}
                </p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{film.score}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
