/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ReplaceProduct from "../_ChildComponents/ReplaceProduct";
import ReplaceQuantity from "../_ChildComponents/ReplaceQuantity";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
import toRupiah from "@/utils/toRupiah";

const ModalChangeOrder = ({
  orderData,
  productsData,
  addonsData,
  vouchersData,
  orderDetailData,
  isVisible,
  closeModal,
  finishModal,
}) => {
  const [productsDataSorted, setProductsDataSorted] = useState([]);
  const [voucherType, setVoucherType] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(null);
  const [personPrice, setPersonPrice] = useState(null);
  const [petPrice, setPetPrice] = useState(null);
  const [print5RBWPrice, setPrint5RBWPrice] = useState(null);
  const [print5RCPrice, setPrint5RCPrice] = useState(null);
  const [softfilePrice, setSoftfilePrice] = useState(null);

  useEffect(() => {
    const productSorted = productsData.filter(
      (item) => item.product_name !== orderData.products.product_name
    );
    console.log("Product Sorted:", productSorted);
    setProductsDataSorted(productSorted);
  }, [isVisible]);

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
          <div className="flex justify-between items-center mb-5">
            <Title title={"Change Order"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>

          <div className="mb-4">
            <p className="font-semibold mb-1">Paket</p>
            <ReplaceProduct
              productsData={productsDataSorted}
              getSelectedProduct={(e) => {
                console.log("Selected Product:", e);
              }}
            />
          </div>

          <div className="mb-4">
            <p className="font-semibold mb-1">Add-ons</p>
            <div className="grid grid-cols-2 grid-rows-4 gap-3 ">
              <div>
                <div className="text-sm">Orang Dewasa</div>
                <div className="text-xs font-semibold">
                  {toRupiah(
                    orderData.transactions.additional_person_price *
                      numberPerson
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={numberPerson}
                  getNumber={(e) => {
                    setNumberPerson(e);
                  }}
                />
              </div>

              <div>
                <div className="text-sm">Hewan Peliharaan</div>
                <div className="text-xs font-semibold">
                  {toRupiah(orderData.transactions.additional_pet_price)}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={orderData.number_of_add_pet}
                  getNumber={(e) => {
                    setNumberPet(e);
                  }}
                />
              </div>

              <div>
                <div className="text-sm">Print5R</div>
                <div className="text-xs font-semibold">
                  {toRupiah(orderData.transactions.additional_print5r_price)}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={orderData.number_of_add_print5r}
                  getNumber={(e) => {
                    setNumberPrint5r(e);
                  }}
                />
              </div>

              <div>
                <div className="text-sm">Soft-File</div>
                <div className="text-xs font-semibold">
                  {toRupiah(orderData.transactions.additional_softfile_price)}
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ReplaceQuantity
                  inputName={"editQty"}
                  placeHolder={""}
                  value={orderData.number_of_add_print5r}
                  getNumber={(e) => {
                    console.log(e);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-3 gap-1 mb-4">
            <div className="text-xs font-sora font-semibold">Subtotal</div>
            {/* Total Price */}
            <div className="text-right text-xs font-roboto font-semibold ">
              {toRupiah(orderData.transactions.total_price)}
            </div>

            <div className="text-xs font-sora font-semibold ">Kode Voucher</div>
            {/* Voucher Code */}
            <div className="text-right text-xs text-blue-900 font-roboto font-semibold">
              {orderData.transactions.voucher_code}
            </div>
            <div></div>
            {/* Discount */}
            <div className="text-right text-xs text-green-500 font-roboto font-semibold">
              {orderDetailData.discount}
            </div>
          </div>

          <div className="grid grid-cols-2 mb-2 gap-1">
            <div className="text-xs font-sora font-semibold">Total</div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {toRupiah(orderData.transactions.total_paid_by_cust)}
            </div>

            <div className="text-xs font-sora font-semibold">
              Additional Cost
            </div>
            {/* Additional Cost */}
            <div className="text-right text-xs font-roboto font-semibold">
              Rp -
            </div>

            <div className="text-xs font-sora font-semibold">New Total</div>
            {/* New Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              Rp -
            </div>
          </div>
        </div>

        <ButtonSubmit label={"Change Order"} />
      </div>
    </div>
  );
};

export default ModalChangeOrder;
