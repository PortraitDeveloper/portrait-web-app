/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import Label from "../_ChildComponents/Label";
import ClipboardWhatsappLink from "../_ChildComponents/ClipboardWhatsappLink";
import ClipboardEmailLink from "../_ChildComponents/ClipboardEmailLink";
import ButtonLink from "../_ChildComponents/ButtonLink";
const emailUrl = process.env.NEXT_PUBLIC_EMAIL_URL;
const waUrl = process.env.NEXT_PUBLIC_WA_URL;

const ModalCustomerDetail = ({
  orderData,
  isVisible,
  closeModal,
  finishModal,
}) => {
  const [toggle, setToggle] = useState(true);

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      closeModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="container"
      onClick={closeHandler}
      className="fixed inset-0 bg-white md:bg-black md:bg-opacity-30 backdrop-blur-sm flex justify-center md:justify-end"
    >
      <div className="bg-white p-6 md:rounded-l-2xl flex flex-col justify-between">
        <div className="w-72">
          <div className="flex justify-between items-center mb-10">
            <Title title={"Customer Detail"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>

          <div className="mb-1">
            <Label
              id={orderData.book_code}
              name={orderData.customers.cust_name}
            />
          </div>

          <div className="mb-1 w-72">
            <ClipboardWhatsappLink
              copytext={orderData.customers.phone_number}
              getClick={() => {
                setToggle(false);
              }}
            />
          </div>

          <div className="w-72">
            <ClipboardEmailLink
              copytext={orderData.customers.email}
              getClick={() => {
                setToggle(true);
              }}
            />
          </div>
        </div>

        <div>
          {toggle && <ButtonLink label={"SendEmail"} url={emailUrl} />}
          {!toggle && (
            <ButtonLink
              label={"Chat on WhatsApp"}
              url={`${waUrl}${orderData.customers.phone_number.replace(
                /\+/g,
                ""
              )}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCustomerDetail;
