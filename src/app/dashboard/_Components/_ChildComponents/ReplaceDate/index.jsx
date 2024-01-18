/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateConvertion from "@/utils/dateConversion";

const ReplaceExpiredDate = ({ expiredDate, getExpiredDate }) => {
  const [replaceExpiredDate, setReplaceExpiredDate] = useState(expiredDate);

  useEffect(() => {
    getExpiredDate(expiredDate);
  }, []);

  const changeHandler = (date) => {
    if (date) {
      const formattedDate = new Date(date.setHours(7, 0, 0)).toISOString();
      setReplaceExpiredDate(dateConvertion(formattedDate));
      getExpiredDate(formattedDate);
    } else {
      getDate(null);
    }
  };

  return (
    <>
      <DatePicker
        selected={null} // Nilai default, sesuaikan sesuai kebutuhan
        onChange={changeHandler}
        placeholderText="Tanggal Kadaluarsa Voucher"
        value={dateConvertion(replaceExpiredDate)}
        dateFormat="dd MMMM yyyy"
        className="border border-black rounded-3xl px-3 py-2 w-72"
      />
    </>
  );
};

export default ReplaceExpiredDate;
