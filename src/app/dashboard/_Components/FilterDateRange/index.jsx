"use client";
import React, { useState } from "react";
import moment from "moment";
import "moment-timezone";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import styles
import "react-date-range/dist/theme/default.css"; // Import theme

const FilterDateRange = ({ getDateRanges }) => {
  const [visible, setVisible] = useState(true);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    getDateRanges(ranges)
  };

  const handleVisible = () => {
    setVisible(!visible);
  };

  const formattedStartDate = moment(dateRange[0].startDate)
    .tz("Asia/Jakarta")
    .format("DD/MM/YY");
  const formattedEndDate = moment(dateRange[0].endDate)
    .tz("Asia/Jakarta")
    .format("DD/MM/YY");

  return (
    <div className="inline-block relative">
      <div
        className="cursor-pointer border border-blue-900 rounded-2xl text-blue-900 text-sm text-center hover:bg-slate-100 p-2 w-48"
        onClick={handleVisible}
      >
        <p className="text-sm">
          {formattedStartDate} to {formattedEndDate}
        </p>
      </div>
      {!visible && (
        <div className="z-10 absolute">
          <DateRange ranges={dateRange} onChange={handleSelect} />
        </div>
      )}
    </div>
  );
};

export default FilterDateRange;
