/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const Message = ({ message, color, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Set timeout
  const timeout = message === "Data tidak ditemukan" ? 2000 : 8000;

  const bgColor =
    color === "red"
      ? "bg-red-50"
      : color === "green"
      ? "bg-green-50"
      : "bg-blue-50";

  const borderColor =
    color === "red"
      ? "border-red-500"
      : color === "green"
      ? "border-green-500"
      : "border-blue-500";

  const textColor =
    color === "red"
      ? "text-red-500"
      : color === "green"
      ? "text-green-500"
      : "text-blue-500";

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timeoutId = setTimeout(() => {
        setIsVisible(false);
        onHide();
      }, timeout);

      return () => clearTimeout(timeoutId);
    }
  }, [message]);

  return (
    <>
      {isVisible && message && (
        <div
          className={`${bgColor} rounded-3xl shadow-lg border ${borderColor} ${textColor} text-sm text-center font-bold font-roboto px-6 py-1 sm:py-2.5`}
        >
          {message}
        </div>
      )}
    </>
  );
};

export default Message;
