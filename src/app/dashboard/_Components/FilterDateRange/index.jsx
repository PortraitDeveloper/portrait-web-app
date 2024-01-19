// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import React, { useState, useEffect } from "react";
// import moment from "moment";
// import "moment-timezone";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css"; // Import styles
// import "react-date-range/dist/theme/default.css"; // Import theme

// const FilterDateRange = ({ getDateRanges }) => {
//   const [dateRange, setDateRange] = useState([
//     {
//       startDate: new Date(),
//       endDate: new Date(),
//       key: "selection",
//     },
//   ]);

//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const closeDropdown = (event) => {
//     // Check whether the click was made outside the dropdown element
//     if (isOpen && !event.target.closest(".account-option")) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     // Add an event listener when the component is first rendered
//     document.addEventListener("click", closeDropdown);

//     // Clean up the event listener when the component is unmounted
//     return () => {
//       document.removeEventListener("click", closeDropdown);
//     };
//   }, [isOpen]);

//   const handleSelect = (ranges) => {
//     setDateRange([ranges.selection]);
//     getDateRanges(ranges);
//   };

//   const formattedStartDate = moment(dateRange[0].startDate)
//     .tz("Asia/Jakarta")
//     .format("DD/MM/YY");
//   const formattedEndDate = moment(dateRange[0].endDate)
//     .tz("Asia/Jakarta")
//     .format("DD/MM/YY");

//   return (
//     <div className="inline-block relative">
//       <div
//         className="cursor-pointer border border-blue-900 rounded-2xl text-blue-900 text-sm text-center hover:bg-slate-100 p-2 w-48"
//         onClick={toggleDropdown}
//       >
//         <p className="text-sm">
//           {formattedStartDate} to {formattedEndDate}
//         </p>
//       </div>
//       {isOpen && (
//         <div className="z-10 absolute">
//           <DateRange ranges={dateRange} onChange={handleSelect} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterDateRange;

/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import "moment-timezone";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Import styles
import "react-date-range/dist/theme/default.css"; // Import theme

const FilterDateRange = ({ getDateRanges }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event) => {
    // Check whether the click was made outside the dropdown element or inside the date range picker
    if (
      isOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !event.target.closest(".rdrDateRangeWrapper")
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add an event listener when the component is first rendered
    document.addEventListener("click", closeDropdown);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [isOpen]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
    getDateRanges(ranges);
  };

  const formattedStartDate = moment(dateRange[0].startDate)
    .tz("Asia/Jakarta")
    .format("DD-MM-YY");
  const formattedEndDate = moment(dateRange[0].endDate)
    .tz("Asia/Jakarta")
    .format("DD-MM-YY");

  return (
    <div className="inline-block relative" ref={dropdownRef}>
      <div
        className="cursor-pointer border border-blue-900 rounded-2xl text-blue-900 text-sm text-center hover:bg-slate-100 p-2 w-48"
        onClick={toggleDropdown}
      >
        <p className="text-sm">
          {formattedStartDate} to {formattedEndDate}
        </p>
      </div>
      {isOpen && (
        <div className="z-10 absolute">
          <DateRange ranges={dateRange} onChange={handleSelect} />
        </div>
      )}
    </div>
  );
};

export default FilterDateRange;
