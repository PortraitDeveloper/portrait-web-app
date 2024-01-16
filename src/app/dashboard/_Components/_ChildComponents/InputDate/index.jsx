import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dateConversion from "@/utils/dateConversion";

const InputDate = ({ getDate }) => {
  const [expiredDate, setExpiredDate] = useState("");
  const changeHandler = (date) => {
    if (date) {
      const formattedDate = new Date(date.setHours(7, 0, 0)).toISOString();
      setExpiredDate(dateConversion(formattedDate));
      getDate(formattedDate);
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
        value={expiredDate}
        dateFormat="dd MMMM yyyy"
        className="border border-black rounded-3xl px-3 py-2.5 w-72"
      />
    </>
  );
};

export default InputDate;
