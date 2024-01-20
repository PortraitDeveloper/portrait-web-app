/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import LabelVoucher from "../_ChildComponents/LabelVoucher";
import ReplaceDiscountType from "../_ChildComponents/ReplaceDiscountType";
import ReplacePercentage from "../_ChildComponents/ReplacePercentage";
import ReplaceNominal from "../_ChildComponents/ReplaceNominal";
import ReplaceDate from "../_ChildComponents/ReplaceDate";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
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
  };

  const submitHandler = async () => {
    setLoading(false);
    const voucherCode = voucherData.voucherCode;

    const body = {
      voucher_code: voucherCode,
      percentage_discount: percentageDiscount,
      nominal_discount: nominalDiscount,
      start_date: voucherData.startDate,
      expired_date: voucherExpired,
    };

    let response = await fetch("/api/data/voucher", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    response = await response.json();
    console.log("Resp:", response);
    setLoading(true);

    if (response.status === 400) {
      setErrorMessage(response.message);
    } else {
      clearStates();
      message = `Voucher dengan kode ${voucherCode} berhasil diubah`;
      finishModal(message, color);
    }
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

            <div className="flex justify-between items-center gap-2 mb-4">
              <div>
                <ReplaceDiscountType
                  voucherType={type}
                  getType={(e) => {
                    setVoucherType(e);
                  }}
                />
              </div>

              <div>
                {voucherType === "percentage" && (
                  <ReplacePercentage
                    placeHolder={""}
                    unit={"%"}
                    getDiscount={(e) => {
                      setPercentageDiscount(e);
                    }}
                  />
                )}
                {voucherType === "nominal" && (
                  <ReplaceNominal
                    placeHolder={""}
                    unit={"Rp"}
                    getDiscount={(e) => {
                      setNominalDiscount(e);
                    }}
                  />
                )}
              </div>
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
              <ButtonSubmit label={"Confirm Edit"} getSubmit={submitHandler} />
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
