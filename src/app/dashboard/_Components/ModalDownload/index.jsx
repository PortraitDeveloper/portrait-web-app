import React, { useState } from "react";
import moment from "moment";
import "moment-timezone";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import FilterDownloadRange from "../FilterDownloadRange";
import InputString from "../_ChildComponents/InputString";
import ButtonDownloadXlsx from "../ButtonDownloadXlsx";

const ModalDownload = ({ isVisible, closeModal, finishModal }) => {
  let color = "green";
  const [message, setMessage] = useState(null);
  const [filename, setFilename] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const clearStates = () => {
    setMessage(null);
    setFilename(null);
    setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
  };

  const closeHandler = (e) => {
    if (e === "closeIcon") {
      clearStates();
      closeModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="container"
      onClick={closeHandler}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-8">
          <Title title={"Download Transactions"} />
          <CloseIcon
            onClose={() => {
              clearStates();
              closeModal();
            }}
          />
        </div>

        <div className="mb-4">
          <FilterDownloadRange
            getDateRanges={(ranges) => {
              setDateRange([ranges.selection]);
            }}
          />
        </div>

        <div className="mb-4">
          <InputString
            inputName="filename"
            placeHolder="Masukan nama file"
            getString={(e) => {
              const createdAt = moment()
                .tz("Asia/Jakarta")
                .format("YYYY-MM-DD_hh-mm_");
              const fileName = createdAt + e;
              console.log(fileName);
              setFilename(fileName);
            }}
          />
        </div>

        <div className="h-10 mb-30">
          <ErrorMessage message={message} />
        </div>

        <div>
          <ButtonDownloadXlsx
            startDate={moment(dateRange[0].startDate)
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD")}
            endDate={moment(dateRange[0].endDate)
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DD")}
            fileName={filename}
            getMessage={(e) => {
              if (e === "Data berhasil diunduh") {
                finishModal(e, color);
                clearStates();
              } else {
                setMessage(e);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalDownload;
