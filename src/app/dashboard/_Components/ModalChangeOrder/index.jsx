/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ReplaceProduct from "../_ChildComponents/ReplaceProduct";
import ReplaceQuantity from "../_ChildComponents/ReplaceQuantity";
import ReplaceSoftfile from "../_ChildComponents/ReplaceSoftfile";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";
import toRupiah from "@/utils/toRupiah";

const ModalChangeOrder = ({
  isVisible,
  productsData,
  addonsData,
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
  closeModal,
  finishModal,
}) => {
  const handleSelectedProduct = (e) => {
    const print5rPrice_ =
      e.product_type === "Black and White"
        ? addonsData[2].item_price * numberPrint5r
        : addonsData[3].item_price * numberPrint5r;
    getProductId(e.product_id);
    getProductBid(e.branch_id);
    getProductName(e.product_name);
    getProductType(e.product_type);
    getProductPrice(e.product_price);
    getPrint5rPrice(print5rPrice_);
  };

  const handlePerson = (e) => {
    const personPrice = addonsData[0].item_price * e;
    getNumberPerson(e);
    getPersonPrice(personPrice);
  };

  const handlePet = (e) => {
    const petPrice = addonsData[1].item_price * e;
    getNumberPet(e);
    getPetPrice(petPrice);
  };

  const handlePrint5r = (e) => {
    const print5rPrice =
      productType === "Black and White"
        ? addonsData[2].item_price * e
        : addonsData[3].item_price * e;
    getNumberPrint5r(e);
    getPrint5rPrice(print5rPrice);
  };

  const handleSoftfile = (e) => {
    const softfilePrice = addonsData[4].item_price * e;
    getNumberSoftfile(e);
    getSoftfilePrice(softfilePrice);
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
          <div className="flex justify-between items-center mb-5">
            <Title title={"Change Order"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <p className="font-semibold mb-1">Ubah Add-ons</p>
            <div className="grid grid-cols-2 grid-rows-4 gap-3 ">
              <div>
                <div className="text-sm">Orang Dewasa</div>
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
                <div className="text-sm">Hewan Peliharaan</div>
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
                <div className="text-sm">
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
                <div className="text-sm">Soft-File</div>
                <div className="text-xs font-semibold">
                  {softfilePrice}
                </div>
              </div>
              <div className="flex justify-end items-center">
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
        </div>
        <ButtonSubmit label={"Change Order"} />
      </div>
    </div>
  );
};

export default ModalChangeOrder;
