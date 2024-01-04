/* eslint-disable react-hooks/exhaustive-deps */
// const Message = ({ message, color }) => {
//   return (
//     <>
//       {color === "red" && message.length > 0 && (
//         <text
//           className={`rounded-3xl shadow-lg border border-red-500 bg-red-50 text-red-500 text-sm font-bold font-roboto px-6 py-2.5`}
//         >
//           {message}
//         </text>
//       )}

//       {color === "green" && message.length > 0 && (
//         <text
//           className={`rounded-3xl shadow-lg border border-green-500 bg-green-50 text-green-500 text-sm font-bold font-roboto px-6 py-2.5`}
//         >
//           {message}
//         </text>
//       )}

//       {color === "blue" && message.length > 0 && (
//         <text
//           className={`rounded-3xl shadow-lg border border-blue-500 bg-blue-50 text-blue-500 text-sm font-bold font-roboto px-6 py-2.5`}
//         >
//           {message}
//         </text>
//       )}
//     </>
//   );
// };

// export default Message;

import React, { useEffect, useState } from "react";

const Message = ({ message, color, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message && message.length > 0) {
      setIsVisible(true);

      const timeoutId = setTimeout(() => {
        setIsVisible(false);
        onHide();
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [message]);

  return (
    <>
      {isVisible && (
        <div
          className={`rounded-3xl shadow-lg border border-${color}-500 bg-${color}-50 text-${color}-500 text-sm font-bold font-roboto px-6 py-2.5`}
        >
          {message}
        </div>
      )}
    </>
  );
};

export default Message;
