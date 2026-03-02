import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder,
  endPlaceholder,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* Start Date */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          From date
        </label>

        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText={startPlaceholder}
          dateFormat="yyyy-MM-dd"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          
          // 👉 render popup to body (FIX cắt popup)
          popperContainer={({ children }) =>
            createPortal(children, document.body)
          }
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          To date
        </label>

        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText={endPlaceholder}
          dateFormat="yyyy-MM-dd"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     dark:bg-gray-800 dark:border-gray-600 dark:text-white"

          popperContainer={({ children }) =>
            createPortal(children, document.body)
          }
        />
      </div>
    </div>
  );
}
