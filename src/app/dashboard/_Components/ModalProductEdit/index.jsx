/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import Label from "../_ChildComponents/Label";
import ReplaceNumber from "../_ChildComponents/ReplaceNumber";
import ReplaceText from "../_ChildComponents/ReplaceText";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";
import ClipboardCopy from "../_ChildComponents/ClipboardCopy";
import ButtonLink from "../_ChildComponents/ButtonLink";
import Intruction from "../_ChildComponents/Intruction";
import thousandConversion from "@/utils/thousandConversion";

const url = process.env.NEXT_PUBLIC_PRODUCT_FORM_URL;

const ModalProductEdit = ({
  isVisible,
  productData,
  closeModal,
  finishModal,
}) => {
  const [productName, setProductName] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productDesc, setProductDesc] = useState(null);
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
    setProductPrice(null);
    setProductDesc(null);
    setErrorMessage("");
    setView(true);
  };

  const submitHandler = async () => {
    setLoading(false);
    let _productId = productData.productId;
    let _productName = productData.productName;

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
      if (productData.productPrice === productPrice) {
        message = `Product dengan ID ${_productId} berhasil diubah`;
        finishModal(message, color);
      } else {
        _productName = _productName + " ".repeat(2) + thousandConversion(productPrice);
        setProductName(_productName);
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
                <Title title="Edit Product" />
                <CloseIcon
                  onClose={() => {
                    clearStates();
                    closeModal();
                  }}
                />
              </div>

              <div className="mb-3">
                <Label
                  id={productData.productId}
                  name={productData.productName}
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
                  inputName={"editProductDesc"}
                  placeHolder={"Ubah deskripsi produk"}
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
                <ButtonSubmit
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
                  message = `Product dengan ID ${productData.productId} berhasil diubah`;
                  clearStates();
                  finishModal(message, color);
                }}
              />
            </div>

            <div className="mb-5 w-72">
              <ClipboardCopy copytext={productName} />
            </div>

            <div className="mb-5 w-72">
              <Intruction
                message={"Copy-Paste nama produk ke halaman formulir YCBM"}
              />
            </div>

            <ButtonLink label={"Go to YCBM"} url={url} />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalProductEdit;
