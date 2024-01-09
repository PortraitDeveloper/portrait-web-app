/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ReplaceString from "../_ChildComponents/ReplaceString";
import ReplaceProductType from "../_ChildComponents/ReplaceProductType";
import ReplaceNumber from "../_ChildComponents/ReplaceNumber";
import ReplaceText from "../_ChildComponents/ReplaceText";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import SubmitButton from "../_ChildComponents/SubmitButton";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";
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
  const [productName, setProductName] = useState(null);
  const [productType, setProductType] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productDesc, setProductDesc] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState(true);
  const [loading, setLoading] = useState(true);

  const clearStates = () => {
    setProductName(null);
    setProductType(null);
    setProductPrice(null);
    setProductDesc(null);
    setErrorMessage("");
    setView(true);
  };

  const submitHandler = async () => {
    setLoading(false);
    let _productName = productName + " " + productType;
    let _productId = productData.productId;

    const body = {
      product_id: _productId,
      product_name: _productName,
      product_price: productPrice,
      product_desc: productDesc,
      branch_id: productData.branch_id,
    };

    let response = await fetch("/api/data/product", {
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
      if (
        productData.productName === _productName &&
        productData.productPrice === productPrice
      ) {
        message = `Product dengan ID ${_productId} berhasil diubah`;
        finishModal(message, color);
      } else {
        _productName = _productName + "  " + thousandConversion(productPrice);
        setProductName(_productName);
        setView(false);
      }
    }
  };

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      clearStates();
      closeModal();
    }
  };

  if (!isVisible) return null;

  let message = null;
  let color = "green";
  const _productId = productData.productId.toUpperCase();
  const rawProductName = productData.productName;
  const splitProductName = rawProductName.split("(");
  const _productName = splitProductName[0].trim();
  const _productType = `(${splitProductName.slice(1).join("(")}`;

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
                <Title title={`Edit Product ${_productId}`} />
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
                  value={_productName}
                  getString={(e) => {
                    setProductName(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <ReplaceProductType
                  productType={_productType}
                  getProductType={(e) => {
                    setProductType(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <ReplaceNumber
                  inputName={"editProductPrice"}
                  placeHolder={"Ubah harga produk"}
                  value={productData.productPrice}
                  getNumber={(e) => {
                    setProductPrice(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <ReplaceText
                  inputName={"editProductPrice"}
                  placeHolder={"Ubah harga produk"}
                  value={productData.productDesc}
                  getText={(e) => {
                    setProductDesc(e);
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
              <Title title={"Copy Product Name"} />
              <CloseIcon
                onClose={() => {
                  message = `Product dengan ID ${_productId} berhasil diubah`;
                  clearStates();
                  finishModal(message, color);
                }}
              />
            </div>

            <div className="mb-5">
              <ClipboardCopy copytext={productName} />
            </div>

            <div className="mb-5">
              <Intruction
                message={"Copy-Paste nama produk ke halaman formulir YCBM"}
              />
            </div>

            <YCBMLink spesicURL={process.env.NEXT_PUBLIC_PRODUCT_FORM_URL} />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalProductEdit;
