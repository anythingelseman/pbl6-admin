"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import apiClient from "@/services/apiClient";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

export const ChartRevenue = ({
  timeOption,
  cinemaId,
}: {
  timeOption: number;
  cinemaId: number;
}) => {
  const [timeStep, setTimeStep] = useState<any[] | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/statistics/time-step`, {
          params: {
            TimeStep: timeOption,
            CinemaId: cinemaId !== -1 ? cinemaId : undefined,
          },
        });
        const data = response.data;
        setTimeStep(data.data.toReversed());
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [timeOption, cinemaId]);

  const labels = timeStep?.map((step: any) => step.label) || [];
  const series = [
    {
      name: "Tổng doanh thu",
      data: timeStep?.map((step: any) => step.totalRevenue) || [],
    },
  ];

  const min = 0;
  const max = Math.max(...series[0].data);

  // const handleReset = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //   }));
  // };

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      // events: {
      //   beforeMount: (chart) => {
      //     chart.windowResizeHandler();
      //   },
      // },
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [...labels],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: min || 0,
      max: max || 100,
    },
  };

  // NextJS Requirement
  // const isWindowAvailable = () => typeof window !== "undefined";

  // if (!isWindowAvailable()) return <></>;

  return (
    <div className="col-span-12 rounded-sm border border-[#e2e8f0] bg-white px-5 pt-8 pb-5 shadow-default sm:px-8 xl:col-span-7">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-[12rem]">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-[1rem] items-center justify-center rounded-full border border-[#3c50e0]">
              <span className="block h-3 w-full max-w-[0.625rem] rounded-full bg-[#3c50e0]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#3c50e0]">{series[0].name}</p>
              <p className="text-xs font-medium">
                {labels[0]} - {labels[labels.length - 1]}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-[11rem] justify-end">
          {/* <div className="inline-flex items-center rounded-md bg-whiter p-2 dark:bg-[#313d4a]"> */}
          {/*   <button */}
          {/*     onClick={() => setOption(0)} */}
          {/*     className={`rounded bg-white py-1 px-3 text-xs font-medium text-black ${ */}
          {/*       option === 0 && "shadow-[0px_1px_3px_rgba(0,0,0,0.12)]" */}
          {/*     } hover:bg-white hover:shadow-[0px_1px_3px_rgba(0,0,0,0.12)]`} */}
          {/*   > */}
          {/*     Day */}
          {/*   </button> */}
          {/*   <button */}
          {/*     onClick={() => setOption(1)} */}
          {/*     className={`rounded bg-white py-1 px-3 text-xs font-medium text-black ${ */}
          {/*       option === 1 && "shadow-[0px_1px_3px_rgba(0,0,0,0.12)]" */}
          {/*     } hover:bg-white hover:shadow-[0px_1px_3px_rgba(0,0,0,0.12)]`} */}
          {/*   > */}
          {/*     Week */}
          {/*   </button> */}
          {/*   <button */}
          {/*     onClick={() => setOption(2)} */}
          {/*     className={`rounded bg-white py-1 px-3 text-xs font-medium text-black ${ */}
          {/*       option === 2 && "shadow-[0px_1px_3px_rgba(0,0,0,0.12)]" */}
          {/*     } hover:bg-white hover:shadow-[0px_1px_3px_rgba(0,0,0,0.12)]`} */}
          {/*   > */}
          {/*     Month */}
          {/*   </button> */}
          {/* </div> */}
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          {timeStep && (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              width="100%"
              height="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
};
