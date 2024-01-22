import React from "react";
import * as XLSX from "xlsx";

const generateExcelData = (data, sheetName = "Sheet1") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
};

const downloadExcel = (data, fileName, sheetName) => {
  const excelBuffer = generateExcelData(data, sheetName);
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const ButtonDownloadXlsx = ({
  accessToken,
  startDate,
  endDate,
  fileName = "example.xlsx",
  sheetName = "Sheet1",
  getMessage,
}) => {
  const handleDownload = async () => {
    if (!fileName || !startDate || !endDate) {
      getMessage("Periode dan nama file wajib diisi");
      return;
    }

    let response = await fetch(
      `/api/data/download/summary/${startDate}/${endDate}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      }
    );

    response = await response.json();

    const status = response.status;
    const message = response.message;
    const data = response.data;

    if (status === 400) {
      getMessage(message);
    } else {
      downloadExcel(data, fileName, sheetName);
      getMessage(message);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-900 text-white rounded-2xl hover:bg-blue-700 text-sm font-semibold px-3 py-2 w-full"
    >
      Download
    </button>
  );
};

export default ButtonDownloadXlsx;
