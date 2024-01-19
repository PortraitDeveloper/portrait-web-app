/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment-timezone";
import ButtonDownloadXlsx from "../dashboard/_Components/ButtonDownloadXlsx";
import FilterDateRange from "../dashboard/_Components/FilterDateRange";

const Download = () => {
  const [message, setMessage] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="w-72 text-center ">
        <h1>Download File</h1>
        <FilterDateRange
          getDateRanges={(ranges) => {
            setDateRange([ranges.selection]);
          }}
        />
        <ButtonDownloadXlsx
          startDate={moment(dateRange[0].startDate)
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DD")}
          endDate={moment(dateRange[0].endDate)
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DD")}
          fileName="20240119_data_summary"
          getMessage={(e) => {
            setMessage(e);
          }}
        />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Download;
