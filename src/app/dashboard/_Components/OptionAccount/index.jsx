/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useState, useEffect } from "react";

const OptionAccount = ({ role, openModalAccount, openModalDownload }) => {
  const [isOpen, setIsOpen] = useState(false);

  const accountHandler = () => {
    openModalAccount();
  };

  const downloadHandler = () => {
    openModalDownload();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event) => {
    // Check whether the click was made outside the dropdown element
    if (isOpen && !event.target.closest(".account-option")) {
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

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center border border-black rounded-xl w-11 h-11 focus:outline-none focus:ring focus:border-blue-900"
          onClick={toggleDropdown}
        >
          <Image src="/logout.png" alt="Logout Icon" width={24} height={24} />
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {role === "backoffice" && (
              <div>
                <button
                  onClick={accountHandler}
                  className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
                >
                  <div className="flex justify-start items-center">
                    <Image
                      src="/setting.png"
                      alt="Logout Icon"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <p>Account Setting</p>
                  </div>
                </button>
                <button
                  onClick={downloadHandler}
                  className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
                >
                  <div className="flex justify-start items-center">
                    <Image
                      src="/download.png"
                      alt="Download Icon"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <p>Download</p>
                  </div>
                </button>
              </div>
            )}

            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
            >
              <div className="flex justify-start items-center text-red-500">
                <Image
                  src="/signout.png"
                  alt="Logout Icon"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Sign Out
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionAccount;
