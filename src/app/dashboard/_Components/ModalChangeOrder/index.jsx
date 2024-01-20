/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ReplaceProduct from "../_ChildComponents/ReplaceProduct";
import ReplaceQuantity from "../_ChildComponents/ReplaceQuantity";
import ReplaceSoftfile from "../_ChildComponents/ReplaceSoftfile";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
import ProcessSubmit from "../_ChildComponents/ProcessSubmit";
import toRupiah from "@/utils/toRupiah";
import calculateOrder from "@/utils/calculateOrder";

const ModalChangeOrder = ({
  isVisible,
  productsData,
  addonsData,
  vouchersData,
  bookId,
  bookCode,
  productId,
  productBid,
  productName,
  productType,
  productPrice,
  numberPerson,
  personPrice,
  numberPet,
  petPrice,
  numberPrint5r,
  print5rPrice,
  numberSoftfile,
  softfilePrice,
  subTotal,
  voucherCode,
  discount,
  total,
  prevTotal,
  priceDiff,
  getProductId,
  getProductBid,
  getProductName,
  getProductType,
  getProductPrice,
  getNumberPerson,
  getPersonPrice,
  getNumberPet,
  getPetPrice,
  getNumberPrint5r,
  getPrint5rPrice,
  getNumberSoftfile,
  getSoftfilePrice,
  getSubTotal,
  getDiscount,
  getTotal,
  getPriceDiff,
  closeModal,
  finishModal,
}) => {
  const [view, setView] = useState(true);
  const [loading, setLoading] = useState(true);

  let message = null;
  let color = "green";

  const handleSelectedProduct = (e) => {
    const productPrice = e.product_price;
    const print5rPrice =
      e.product_type === "Black and White"
        ? addonsData[2].item_price * numberPrint5r
        : addonsData[3].item_price * numberPrint5r;

    getProductId(e.product_id);
    getProductBid(e.branch_id);
    getProductName(e.product_name);
    getProductType(e.product_type);
    getProductPrice(e.product_price);
    getPrint5rPrice(print5rPrice);

    const result = calculateOrder(
      productPrice,
      personPrice,
      petPrice,
      print5rPrice,
      softfilePrice,
      voucherCode,
      vouchersData,
      prevTotal
    );

    getSubTotal(result.subTotal);
    getSubTotal(result.subTotal);
    getDiscount(result.discount);
    getTotal(result.total);
    getPriceDiff(result.priceDiff);
  };

  const handlePerson = (e) => {
    const personPrice = addonsData[0].item_price * e;
    getNumberPerson(e);
    getPersonPrice(personPrice);

    const result = calculateOrder(
      productPrice,
      personPrice,
      petPrice,
      print5rPrice,
      softfilePrice,
      voucherCode,
      vouchersData,
      prevTotal
    );

    getSubTotal(result.subTotal);
    getSubTotal(result.subTotal);
    getDiscount(result.discount);
    getTotal(result.total);
    getPriceDiff(result.priceDiff);
  };

  const handlePet = (e) => {
    const petPrice = addonsData[1].item_price * e;
    getNumberPet(e);
    getPetPrice(petPrice);

    const result = calculateOrder(
      productPrice,
      personPrice,
      petPrice,
      print5rPrice,
      softfilePrice,
      voucherCode,
      vouchersData,
      prevTotal
    );

    getSubTotal(result.subTotal);
    getSubTotal(result.subTotal);
    getDiscount(result.discount);
    getTotal(result.total);
    getPriceDiff(result.priceDiff);
  };

  const handlePrint5r = (e) => {
    const print5rPrice =
      productType === "Black and White"
        ? addonsData[2].item_price * e
        : addonsData[3].item_price * e;
    getNumberPrint5r(e);
    getPrint5rPrice(print5rPrice);

    const result = calculateOrder(
      productPrice,
      personPrice,
      petPrice,
      print5rPrice,
      softfilePrice,
      voucherCode,
      vouchersData,
      prevTotal
    );

    getSubTotal(result.subTotal);
    getSubTotal(result.subTotal);
    getDiscount(result.discount);
    getTotal(result.total);
    getPriceDiff(result.priceDiff);
  };

  const handleSoftfile = (e) => {
    const softfilePrice = addonsData[4].item_price * e;
    getNumberSoftfile(e);
    getSoftfilePrice(softfilePrice);

    const result = calculateOrder(
      productPrice,
      personPrice,
      petPrice,
      print5rPrice,
      softfilePrice,
      voucherCode,
      vouchersData,
      prevTotal
    );

    getSubTotal(result.subTotal);
    getSubTotal(result.subTotal);
    getDiscount(result.discount);
    getTotal(result.total);
    getPriceDiff(result.priceDiff);
  };

  const submitHandler = async () => {
    setLoading(false);
    const body = {
      book_id: bookId,
      book_code: bookCode,
      product_id: productId,
      number_of_add_person: numberPerson,
      number_of_add_pet: numberPet,
      number_of_add_print5r: numberPrint5r,
      is_add_softfile: numberSoftfile,
      product_price: productPrice,
      additional_person_price: personPrice,
      additional_pet_price: petPrice,
      additional_print5r_price: print5rPrice,
      additional_softfile_price: softfilePrice,
      total_price: subTotal,
      total_paid_by_cust: total,
      prev_total: prevTotal,
      price_diff: priceDiff,
    };

    let response = await fetch("/api/data/book", {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    response = await response.json();
    message = response.message;
    color = response.status === 400 ? "red" : color;

    setLoading(true);
    finishModal(message, color);
  };

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
          <div className="flex justify-between items-center mb-3">
            <Title title={"Change Order"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>

          <div className="mb-3">
            <p className="font-semibold mb-1">Ubah Paket</p>
            <div className="text-sm mb-1">
              <ReplaceProduct
                productBid={productBid}
                productId={productId}
                productName={productName}
                productsData={productsData}
                getSelectedProduct={(e) => {
                  handleSelectedProduct(e);
                }}
              />
            </div>
            <p className="text-xs font-semibold">{toRupiah(productPrice)}</p>
          </div>

          <div className="mb-3">
            <p className="font-semibold mb-1">Ubah Add-ons</p>
            <div className="grid grid-cols-2 grid-rows-4 gap-3 ">
              <div>
                <div className="text-xs">Orang Dewasa</div>
                <div className="text-xs font-semibold">
                  {toRupiah(personPrice)}
                </div>
              </div>
              <div className="flex justify-end items-center text-sm">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={numberPerson}
                  getNumber={(e) => {
                    handlePerson(e);
                  }}
                />
              </div>

              <div>
                <div className="text-xs">Hewan Peliharaan</div>
                <div className="text-xs font-semibold">
                  {toRupiah(petPrice)}
                </div>
              </div>
              <div className="flex justify-end items-center text-sm">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={numberPet}
                  getNumber={(e) => {
                    handlePet(e);
                  }}
                />
              </div>

              <div>
                <div className="text-xs">
                  {productType === "Black and White"
                    ? "Print5R (B&W)"
                    : "Print5R (Color)"}
                </div>
                <div className="text-xs font-semibold">
                  {toRupiah(print5rPrice)}
                </div>
              </div>
              <div className="flex justify-end items-center text-sm">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={numberPrint5r}
                  getNumber={(e) => {
                    handlePrint5r(e);
                  }}
                />
              </div>

              <div>
                <div className="text-xs">Soft-File</div>
                <div className="text-xs font-semibold">
                  {toRupiah(softfilePrice)}
                </div>
              </div>
              <div className="flex justify-end items-center text-sm">
                <ReplaceSoftfile
                  inputName={"softfileExist"}
                  placeHolder={""}
                  value={numberSoftfile}
                  getNumber={(e) => {
                    handleSoftfile(e);
                  }}
                />
              </div>
            </div>
          </div>

          <hr className="border mb-1"></hr>

          <div className="grid grid-cols-2 grid-rows-4 gap-1 mb-1">
            <div className="text-xs font-sora font-semibold">Subtotal</div>
            {/* Total Price */}
            <div className="text-right text-xs font-roboto font-semibold ">
              {toRupiah(subTotal)}
            </div>

            <div className="text-xs font-sora font-semibold ">Kode Voucher</div>
            {/* Voucher Code */}
            <div className="text-right text-xs text-blue-900 font-roboto font-semibold">
              {voucherCode}
            </div>

            <div></div>
            {/* Discount */}
            <div className="text-right text-xs text-green-500 font-roboto font-semibold">
              {toRupiah(discount)}
            </div>

            <div className="text-xs font-sora font-semibold">Total</div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {toRupiah(total)}
            </div>

            <div className="text-xs font-sora font-semibold">
              Previous Total
            </div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {toRupiah(prevTotal)}
            </div>

            <div className="text-xs font-sora font-semibold">
              Price Difference
            </div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {toRupiah(priceDiff)}
            </div>
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
  );
};

export default ModalChangeOrder;
