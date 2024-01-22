import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import InputString from "../_ChildComponents/InputString";
import SelectDiscountType from "../_ChildComponents/SelectDiscountType";
import InputPercentage from "../_ChildComponents/InputPercentage";
import InputNominal from "../_ChildComponents/InputNominal";
import InputDate from "../_ChildComponents/InputDate";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";

const ModalVoucherAdd = ({
  accessToken,
  isVisible,
  closeModal,
  finishModal,
}) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherType, setVoucherType] = useState("percentage");
  const [percentageDiscount, setPercentageDiscount] = useState(null);
  const [nominalDiscount, setNominalDiscount] = useState(null);
  const [voucherExpired, setVoucherExpired] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  let message = null;
  let color = "blue";

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      clearStates();
      closeModal();
    }
  };

  const clearStates = () => {
    setVoucherCode("");
    setVoucherType("percentage");
    setPercentageDiscount(null);
    setNominalDiscount(null);
    setVoucherExpired(null);
    setErrorMessage("");
  };

  const submitHandler = async () => {
    setLoading(false);

    const body = {
      voucher_code: voucherCode,
      percentage_discount: !percentageDiscount ? null : percentageDiscount,
      nominal_discount: !nominalDiscount ? null : nominalDiscount,
      expired_date: voucherExpired,
    };

    let response = await fetch("/api/data/voucher", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify(body),
    });

    response = await response.json();
    setLoading(true);

    if (response.status === 400) {
      setErrorMessage(response.message);
    } else {
      clearStates();
      message = `Voucher dengan kode ${voucherCode} telah ditambahkan`;
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
            <div className="flex justify-between items-center mb-6">
              <Title title={"Add voucher"} />
              <CloseIcon
                onClose={() => {
                  clearStates();
                  closeModal();
                }}
              />
            </div>

            <div className="mb-4">
              <InputString
                inputName="voucher"
                placeHolder={"Kode Voucher"}
                getString={(e) => {
                  setVoucherCode(e);
                }}
              />
            </div>

            <div className="flex justify-between items-center gap-2 mb-4">
              <div>
                <SelectDiscountType
                  getDiscountType={(e) => {
                    setVoucherType(e);
                  }}
                />
              </div>

              <div>
                {voucherType === "percentage" ? (
                  <InputPercentage
                    inputName="percentageDiscount"
                    unit="%"
                    placeHolder={""}
                    getDiscount={(e) => {
                      setPercentageDiscount(e);
                    }}
                  />
                ) : (
                  <InputNominal
                    inputName="nominalDiscount"
                    unit="Rp"
                    placeHolder={""}
                    getDiscount={(e) => {
                      setNominalDiscount(e);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="mb-4">
              <InputDate
                getDate={(e) => {
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
              <ButtonSubmit label={"Add voucher"} getSubmit={submitHandler} />
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

export default ModalVoucherAdd;
