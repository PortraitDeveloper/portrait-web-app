import React from 'react';
import axios from 'axios';

// npm install xlsx

const downloadExcel = async (data) => {
  try {
    const response = await axios.get(`/api/downloadExcel?data=${JSON.stringify(data)}`, { responseType: 'blob' });

    // Create a temporary anchor element and trigger the download
    const anchor = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([response.data]));
    anchor.href = url;
    anchor.download = 'excelFile.xlsx';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
  }
};

const YourComponent = () => {
  const yourData = [
    // your array of data objects
  ];

  return (
    <div>
      {/* Your component content */}
      <button onClick={() => downloadExcel(yourData)}>Download Excel</button>
    </div>
  );
};

export default YourComponent;
