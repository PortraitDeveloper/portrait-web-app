import { useState, useEffect } from "react";
import Image from "next/image";

const ClipboardEmailLink = ({ copytext, getClick }) => {
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(copytext)
      .then(() => {
        setMessage("Email copied, ready to send email");
        setMessageColor("text-green-500");
        getClick()
      })
      .catch((err) => {
        setMessage(`Failed to copy email to clipboard: ${err}`);
        setMessageColor("text-red-500");
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage("");
      setMessageColor("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <>
      <div className="h-6 mb-1">
        <p className={`font-semibold text-sm ${messageColor}`}>{message}</p>
      </div>

      <div className="flex justify-center items-center">
        <div
          className={`border-[1.5px] border-black rounded-2xl px-3 py-2 w-full mr-5`}
        >
          <p>{copytext}</p>
        </div>

        <button
          onClick={handleCopyToClipboard}
          className="p-2 border-[1.5px] border-black hover:border-blue-900 rounded-2xl hover:bg-slate-100"
        >
          <Image src="/email.png" alt="Email Icon" width={24} height={24} />
        </button>
      </div>
    </>
  );
};

export default ClipboardEmailLink;
