"use client";
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ReplaceString from "../_ChildComponents/ReplaceString";
import SelectProductType from "../_ChildComponents/SelectProductType";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import SubmitButton from "../_ChildComponents/SubmitButton";

import ClipboardCopy from "../_ChildComponents/ClipboardCopy";
import YCBMLink from "../_ChildComponents/YCBMLink";
import Intruction from "../_ChildComponents/Intruction";

import thousandConversion from "@/utils/thousandConversion";

const ModalProductEdit = ({
  isVisible,
  productData,
  closeModal,
  finishModal,
}) => {
  let message = null;
  let color = "green";
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("(Black and White)");
  const [branchId, setBranchId] = useState("null");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState(true);

  const clearStates = () => {
    setProductName("");
    setProductType("(Black and White)");
    setBranchId("null");
    setProductPrice(0);
    setProductDesc("");
    setErrorMessage("");
    setView(true);
  };

  const submitHandler = async () => {
    let _productName = productName + " " + productType;

    const body = {
      product_name: _productName,
      branch_id: branchId,
      product_price: productPrice,
      product_desc: productDesc,
    };

    let response = await fetch("/api/data/product", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    response = await response.json();
    console.log(response);

    if (response.status === 400) {
      setErrorMessage(response.message);
    } else {
      _productName = _productName + "  " + thousandConversion(productPrice);
      setProductName(_productName);
      setProductId(response.data.product_id);
      setView(false);
    }
  };

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      clearStates();
      closeModal();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {view && (
        <div
          id="container"
          onClick={closeHandler}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-end"
        >
          <div className="bg-white p-6 rounded-l-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <Title
                  title={`Edit Product ${productData.productId.toUpperCase()}`}
                />
                <CloseIcon
                  onClose={() => {
                    clearStates();
                    closeModal();
                  }}
                />
              </div>

              <div className="mb-3">
                <ReplaceString
                  inputName={"editProductName"}
                  placeHolder={"Ubah nama produk"}
                  value={productData.product_id}
                  getString={(e) => {
                    console.log(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <SelectProductType
                  getProductType={(e) => {
                    setProductType(e);
                  }}
                />
              </div>

              <div className="h-6">
                <ErrorMessage message={errorMessage} />
              </div>
            </div>

            <div>
              <SubmitButton label={"Confirm Edit"} getSubmit={submitHandler} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalProductEdit;
