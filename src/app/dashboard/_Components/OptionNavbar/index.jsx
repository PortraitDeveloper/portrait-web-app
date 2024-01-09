/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const OptionNavbar = ({ openModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const clickHandler = () => {
    openModal();
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
          <Image src="/navbar.png" alt="Logout Icon" width={24} height={24} />
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              href="/dashboard/backoffice/transaction"
              className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
            >
              Transaction
            </Link>
            <Link
              href="/dashboard/backoffice/product"
              className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
            >
              Product
            </Link>
            <Link
              href="/dashboard/backoffice/additional"
              className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
            >
              Additional
            </Link>
            <Link
              href="/dashboard/backoffice/voucher"
              className="block px-4 py-2 text-sm text-gray-700 hover:font-bold"
            >
              Voucher
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionNavbar;
