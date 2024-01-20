import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import SelectBranch from "../_ChildComponents/SelectBranch";
import SelectProductType from "../_ChildComponents/SelectProductType";
import InputString from "../_ChildComponents/InputString";
import InputNumber from "../_ChildComponents/InputNumber";
import InputText from "../_ChildComponents/InputText";
import ErrorMessage from "../_ChildComponents/ErrorMessage";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";
import ClipboardCopy from "../_ChildComponents/ClipboardCopy";
import ButtonLink from "../_ChildComponents/ButtonLink";
import Intruction from "../_ChildComponents/Intruction";
import thousandConversion from "@/utils/thousandConversion";

const ModalProductAdd = ({
  isVisible,
  branchesData,
  closeModal,
  finishModal,
}) => {
  const [branchId, setBranchId] = useState("null");
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("(Black and White)");
  const [productPrice, setProductPrice] = useState(0);
  const [productDesc, setProductDesc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState(true);
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
    setBranchId("null");
    setProductName("");
    setProductType("(Black and White)");
    setProductPrice(0);
    setProductDesc("");
    setErrorMessage("");
    setView(true);
  };

  const submitHandler = async () => {
    setLoading(false);
    let _productName =
      !productType || productType === ""
        ? productName
        : productName + " " + productType;
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
    setLoading(true);

    if (response.status === 400) {
      setErrorMessage(response.message);
    } else {
      _productName =
        _productName + " ".repeat(2) + thousandConversion(productPrice);
      setProductName(_productName);
      setProductId(response.data.product_id);
      setView(false);
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
                <Title title={"Add Product"} />
                <CloseIcon
                  onClose={() => {
                    clearStates();
                    closeModal();
                  }}
                />
              </div>

              <div className="mb-3">
                <SelectBranch
                  branchesData={branchesData}
                  getBranchId={(e) => {
                    setBranchId(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <InputString
                  inputName="product"
                  placeHolder={"Nama Produk"}
                  getString={(e) => {
                    setProductName(e);
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

              <div className="mb-3">
                <InputNumber
                  inputName="price"
                  placeHolder={"Harga"}
                  getNumber={(e) => {
                    setProductPrice(e);
                  }}
                />
              </div>

              <div className="mb-3">
                <InputText
                  inputName="description"
                  placeHolder={"Deskripsi (Optional)"}
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
                <ButtonSubmit label={"Add Product"} getSubmit={submitHandler} />
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
                  message = `Produk dengan ID ${productId} telah ditambahkan`;
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

            <ButtonLink
              label={"Go to YCBM"}
              url={process.env.NEXT_PUBLIC_PRODUCT_FORM_URL}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalProductAdd;
