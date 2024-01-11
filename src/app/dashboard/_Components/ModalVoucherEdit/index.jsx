/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import LabelVoucher from "../_ChildComponents/LabelVoucher";
import ReplaceDiscountType from "../_ChildComponents/ReplaceDiscountType";
import ReplaceDiscount from "../_ChildComponents/ReplaceDiscount";
import ReplaceDate from "../_ChildComponents/ReplaceDate";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import SubmitButton from "../_ChildComponents/SubmitButton";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";

const ModalVoucherEdit = ({
  isVisible,
  type,
  voucherData,
  closeModal,
  finishModal,
}) => {
  const [voucherType, setVoucherType] = useState("percentage");
  const [percentageDiscount, setPercentageDiscount] = useState(null);
  const [nominalDiscount, setNominalDiscount] = useState(null);
  const [voucherExpired, setVoucherExpired] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  let message = null;
  let color = "green";

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      clearStates();
      closeModal();
    }
  };

  const clearStates = () => {
    setVoucherType("percentage");
    setPercentageDiscount(null);
    setNominalDiscount(null);
    setVoucherExpired(null);
    setErrorMessage("");
    setView(true);
  };

  const submitHandler = async () => {
    // setLoading(false);
    // let _voucherId = voucherData.voucherId;
    // let _voucherName = voucherData.voucherName;
    // const body = {
    //   voucher_id: _voucherId,
    //   voucher_name: _voucherName,
    //   voucher_price: voucherPrice,
    //   voucher_desc: voucherDesc,
    //   branch_id: voucherData.branch_id,
    // };
    // let response = await fetch("/api/data/voucher", {
    //   method: "PATCH",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
    // response = await response.json();
    // setLoading(true);
    // if (response.status === 400) {
    //   setErrorMessage(response.message);
    // } else {
    //   if (voucherData.voucherPrice === voucherPrice) {
    //     message = `voucher dengan ID ${_voucherId} berhasil diubah`;
    //     finishModal(message, color);
    //   } else {
    //     _voucherName = _voucherName + "  " + thousandConversion(voucherPrice);
    //     setVoucherName(_voucherName);
    //     setView(false);
    //   }
    // }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        id="container"
        onClick={closeHandler}
        className="fixed inset-0 bg-white md:bg-black md:bg-opacity-30 backdrop-blur-sm flex justify-center md:justify-end"
      >
        <div className="bg-white p-6 md:rounded-l-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <Title title="Edit voucher" />
              <CloseIcon
                onClose={() => {
                  clearStates();
                  closeModal();
                }}
              />
            </div>

            <div className="mb-3">
              <LabelVoucher
                voucherCode={voucherData.voucherCode}
                voucherType={type}
                voucherDiscount={voucherData.voucherDiscount}
              />
            </div>

            <div className="mb-3">
              <ReplaceDiscountType
                voucherType={type}
                getType={(e) => {
                  setVoucherType(e);
                }}
              />
            </div>

            <div className="mb-3">
              {voucherType === "percentage" && (
                <ReplaceDiscount
                  placeHolder={"Contoh : 20%"}
                  unit={"%"}
                  getDiscount={(e) => {
                    setPercentageDiscount(e);
                  }}
                />
              )}
              {voucherType === "nominal" && (
                <ReplaceDiscount
                  placeHolder={"Contoh : 20000 IDR"}
                  unit={"IDR"}
                  getDiscount={(e) => {
                    setNominalDiscount(e);
                  }}
                />
              )}
            </div>

            <div className="mb-3">
              <ReplaceDate
                expiredDate={voucherData.expiredDate}
                getExpiredDate={(e) => {
                  setVoucherExpired(e);
                }}
              />
            </div>

            <div className="h-6">
              <ErrorMessage message={errorMessage} />
            </div>
          </div>

          {loading && (
            <div>
              <SubmitButton label={"Confirm Edit"} getSubmit={submitHandler} />
            </div>
          )}

          {!loading && (
            <div>
              <ProcessSubmit label={"Process..."} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalVoucherEdit;
