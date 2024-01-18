"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment-timezone";
import FilterDateRange from "../_Components/FilterDateRange";

const TestPage = () => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const clickHandler = () => {
    const formattedStartDate = moment(dateRange[0].startDate)
      .tz("Asia/Jakarta")
      .format();
    const formattedEndDate = moment(dateRange[0].endDate)
      .tz("Asia/Jakarta")
      .format();

    console.log("start:", formattedStartDate);
    console.log("end:", formattedEndDate);
  };

  const formattedStartDate = moment(dateRange[0].startDate)
    .tz("Asia/Jakarta")
    .format("DD/MM/YY");
  const formattedEndDate = moment(dateRange[0].endDate)
    .tz("Asia/Jakarta")
    .format("DD/MM/YY");

  return (
    <>
      <FilterDateRange
        getDateRanges={(ranges) => {
          setDateRange([ranges.selection]);
        }}
      />
      <p>Start-Date: {formattedStartDate}</p>
      <p>End-Date: {formattedEndDate}</p>

      <button
        className="border border-black hover:bg-blue-500"
        onClick={clickHandler}
      >
        Click
      </button>
    </>
  );
};

export default TestPage;
