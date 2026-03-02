import { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

interface DashboardDateRange {
  from_date: string;
  to_date: string;
}

interface StatisticsChartProps {
  categories: string[];
  salesData: number[];
  revenueData: number[];
  isLoading: boolean;
  isError: boolean;
  selectedRange?: DashboardDateRange;
  onDateRangeChange?: (range: DashboardDateRange) => void;
}

export default function StatisticsChart({
  categories,
  salesData,
  revenueData,
  isLoading,
  isError,
  selectedRange,
  onDateRangeChange,
}: StatisticsChartProps) {
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const toIsoDate = (date: Date) => date.toISOString().split("T")[0];

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const defaultFromDate = selectedRange?.from_date
      ? new Date(selectedRange.from_date)
      : sevenDaysAgo;
    const defaultToDate = selectedRange?.to_date
      ? new Date(selectedRange.to_date)
      : today;

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [defaultFromDate, defaultToDate],
      clickOpens: true,
      onChange: (selectedDates) => {
        if (selectedDates.length !== 2) return;

        onDateRangeChange?.({
          from_date: toIsoDate(selectedDates[0]),
          to_date: toIsoDate(selectedDates[1]),
        });
      },
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, [onDateRangeChange, selectedRange?.from_date, selectedRange?.to_date]);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#0a0a0a", "#737373"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
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
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: salesData,
    },
    {
      name: "Revenue",
      data: revenueData,
    },
  ];

  const isEmpty = !isLoading && !isError && categories.length === 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Sales and revenue trend for selected range
          </p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 size-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 lg:w-40 lg:h-auto  lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {isLoading ? (
            <div className="flex h-[310px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              Loading statistics...
            </div>
          ) : isError ? (
            <div className="flex h-[310px] items-center justify-center text-sm text-red-500">
              Failed to load statistics.
            </div>
          ) : isEmpty ? (
            <div className="flex h-[310px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              No statistics data for selected range.
            </div>
          ) : (
            <Chart options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
}
