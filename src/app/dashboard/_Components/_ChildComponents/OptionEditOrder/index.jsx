/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const OptionEditOrder = ({
  role,
  data,
  onOrderDetail,
  onChangeOrder,
  onCustomerDetail,
  onRefund,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCustomerDetail = () => {
    onCustomerDetail(data);
  };

  const getOrderDetail = () => {
    onOrderDetail(data);
  };

  const getChangeOrder = () => {
    onChangeOrder(data);
  };

  const getRefund = () => {
    onRefund(data);
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
    <div className="inline-block text-left relative">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="border border-blue-900 rounded-3xl px-3 py-1 sm:px-6 sm:py-2 text-blue-900 text-sm hover:bg-blue-900 hover:text-white"
        >
          Edit
        </button>
      </div>

      {isOpen && (
        <div className="z-10 origin-top-right absolute right-0 mt-2 w-36 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={getOrderDetail}
              className="block px-4 py-2 text-sm hover:font-bold"
            >
              <p>Order Detail</p>
            </button>
            <button
              onClick={getChangeOrder}
              className="block px-4 py-2 text-sm hover:font-bold"
            >
              <p>Change Order</p>
            </button>
            <button
              onClick={getCustomerDetail}
              className="block px-4 py-2 text-sm hover:font-bold"
            >
              <p>Customer Detail</p>
            </button>
            {role === "backoffice" && (
              <button
                onClick={getRefund}
                className="block px-4 py-2 text-sm text-red-500 hover:font-bold"
              >
                <p>Refund</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionEditOrder;
