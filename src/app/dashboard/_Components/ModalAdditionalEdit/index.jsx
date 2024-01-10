/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import Label from "../_ChildComponents/Label";
import ReplaceNumber from "../_ChildComponents/ReplaceNumber";
import ReplaceText from "../_ChildComponents/ReplaceText";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import SubmitButton from "../_ChildComponents/SubmitButton";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";
import ClipboardCopy from "../_ChildComponents/ClipboardCopy";
import YCBMLink from "../_ChildComponents/YCBMLink";
import Intruction from "../_ChildComponents/Intruction";
import thousandConversion from "@/utils/thousandConversion";

const url = process.env.NEXT_PUBLIC_FORM_URL;

const ModalAdditionalEdit = ({
  isVisible,
  additionalData,
  closeModal,
  finishModal,
}) => {
  const [additionalPrice, setAdditionalPrice] = useState(null);
  const [additionalDesc, setAdditionalDesc] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState(true);
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
    setAdditionalPrice(null);
    setAdditionalDesc(null);
    setErrorMessage("");
    setView(true);
  };

  const submitHandler = async () => {
    setLoading(false);
    let _itemId = additionalData.itemId;
    let _itemName = additionalData.itemName;

    const body = {
      item_id: _itemId,
      item_name: _itemName,
      item_price: additionalPrice,
      item_desc: additionalDesc,
    };

    let response = await fetch("/api/data/additional", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    response = await response.json();
    setLoading(true);

    if (response.status === 400) {
      setErrorMessage(response.message);
    } else {
      if (additionalData.itemPrice === additionalPrice) {
        message = `additional dengan ID ${_itemId} berhasil diubah`;
        finishModal(message, color);
      } else {
        const _itemPrice = thousandConversion(additionalPrice);
        setAdditionalPrice(_itemPrice);
        setView(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {view && (
        <div
          id="container"
          onClick={closeHandler}
          className="fixed inset-0 bg-white md:bg-black md:bg-opacity-30 backdrop-blur-sm flex justify-center md:justify-end"
        >
          <div className="bg-white p-6 md:rounded-l-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <Title title="Edit Add-ons" />
                <CloseIcon
                  onClose={() => {
                    clearStates();
                    closeModal();
                  }}
                />
              </div>

              <div className="mb-3">
                <Label
                  id={additionalData.itemId}
                  name={additionalData.itemName}
                />
              </div>

              <div className="mb-3">
                <ReplaceNumber
                  inputName={"editAdditionalPrice"}
                  placeHolder={"Ubah harga add-ons"}
                  value={additionalData.itemPrice}
                  getNumber={(e) => {
                    setAdditionalPrice(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <ReplaceText
                  inputName={"editAdditionalDesc"}
                  placeHolder={"Ubah deskripsi produk"}
                  value={additionalData.itemDesc}
                  getText={(e) => {
                    setAdditionalDesc(e);
                  }}
                />
              </div>

              <div className="h-6">
                <ErrorMessage message={errorMessage} />
              </div>
            </div>

            {loading && (
              <div>
                <SubmitButton
                  label={"Confirm Edit"}
                  getSubmit={submitHandler}
                />
              </div>
            )}

            {!loading && (
              <div>
                <ProcessSubmit label={"Process..."} />
              </div>
            )}
          </div>
        </div>
      )}

      {!view && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <Title title={"Copy Add-ons Name"} />
              <CloseIcon
                onClose={() => {
                  message = `Add-ons dengan ID ${additionalData.itemId} berhasil diubah`;
                  clearStates();
                  finishModal(message, color);
                }}
              />
            </div>

            <div className="mb-5 w-72">
              <ClipboardCopy copytext={additionalPrice} />
            </div>

            <div className="mb-5 w-72">
              <Intruction
                message={"Copy-Paste harga add-ons ke halaman formulir YCBM"}
              />
            </div>

            <YCBMLink spesicURL={url} />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalAdditionalEdit;
