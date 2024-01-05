/* eslint-disable react-hooks/exhaustive-deps */
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
