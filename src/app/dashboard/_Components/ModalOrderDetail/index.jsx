/* eslint-disable @next/next/no-img-element */
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import ClipboardCopyLink from "../_ChildComponents/ClipboardCopyLink";

const ModalOrderDetail = ({
  orderData,
  orderDetailData,
  isVisible,
  closeModal,
  finishModal,
}) => {
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
            <Title title={"Order Detail"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>

          {/* Booking Detail */}
          <div className="font-roboto">
            {/* Book Code */}
            <div className="text-xs font-semibold">{orderData.book_code}</div>
          </div>

          <div className="flex justify-between items-center mb-2">
            {/* Booking Date */}
            <div className="text-xs">{orderDetailData.booking_date}</div>

            <div className="flex justify-end">
              <span className="bg-blue-900 rounded-xl text-white text-xs flex justify-center items-center px-2 py-1">
                <img
                  src="/clock.png"
                  alt="Clock Icon"
                  className="max-w-full h-auto rounded-full"
                />
                {/* Start At */}
                <p className="pl-1">{orderData.start_at} WIB</p>
              </span>
            </div>
          </div>

          <hr className="border mb-1"></hr>

          {/* Product */}
          <div className="grid grid-cols-2 grid-rows-3 mb-1">
            <div className="text-xs font-sora font-semibold">Paket</div>
            <div></div>
            {/* Product Name */}
            <div className="text-xs font-roboto">
              {orderDetailData.product_name}
            </div>
            {/* Product Price */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.product_price}
            </div>
            {/* Product Type */}
            <div className="text-xs text-slate-400 font-roboto italic">
              {orderDetailData.product_type}
            </div>
            <div></div>
          </div>

          <hr className="border mb-1"></hr>

          {/* Additional */}
          <div className="grid grid-cols-2 grid-rows-9 mb-1">
            <div className="text-xs font-sora font-semibold">Add-ons</div>
            <div></div>

            {/* Person */}
            <div className="text-xs font-roboto">Orang Dewasa</div>
            <div></div>
            {/* Number of Add Person */}
            <div className="text-xs text-slate-400 font-roboto">
              {orderDetailData.number_of_add_person}
            </div>
            {/* Additional Person Price */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.additional_person_price}
            </div>

            {/* Pet */}
            <div className="text-xs font-roboto">Hewan Peliharaan</div>
            <div></div>
            {/* Number of Add Pet */}
            <div className="text-xs text-slate-400 font-roboto">
              {orderDetailData.number_of_add_pet}
            </div>
            {/* Additional Pet Price */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.additional_pet_price}
            </div>

            {/* Print5R */}
            <div className="text-xs font-roboto">Print 5R</div>
            <div></div>
            {/* Number of Add Print5R */}
            <div className="text-xs text-slate-400 font-roboto">
              {orderDetailData.number_of_add_print5r}
            </div>
            {/* Additional Print5R Price */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.additional_print5r_price}
            </div>

            {/* Soft-File */}
            <div className="text-xs font-roboto">Soft-File</div>
            <div></div>
            {/* Number of Add Softfile */}
            <div className="text-xs text-slate-400 font-roboto">
              {orderDetailData.number_of_add_softfile}
            </div>
            {/* Additional Softfile Price */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.additional_softfile_price}
            </div>
          </div>

          <hr className="border mb-1"></hr>

          <div className="grid grid-cols-2 grid-rows-3 gap-1 mb-1">
            <div className="text-xs font-sora font-semibold">Subtotal</div>
            {/* Total Price */}
            <div className="text-right text-xs font-roboto font-semibold ">
              {orderDetailData.total_price}
            </div>

            <div className="text-xs font-sora font-semibold ">Kode Voucher</div>
            {/* Voucher Code */}
            <div className="text-right text-xs text-blue-900 font-roboto font-semibold">
              {orderDetailData.voucher_code}
            </div>
            <div></div>
            {/* Discount */}
            <div className="text-right text-xs text-green-500 font-roboto font-semibold">
              {orderDetailData.discount}
            </div>
          </div>

          <hr className="border mb-1"></hr>

          <div className="grid grid-cols-2 mb-2 gap-1">
            <div className="text-xs font-sora font-semibold">Total</div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.total_paid_by_cust}
            </div>

            <div className="text-xs font-sora font-semibold">
              Previous Total
            </div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.new_total}
            </div>

            <div className="text-xs font-sora font-semibold">
              Price Difference
            </div>
            {/* Total */}
            <div className="text-right text-xs font-roboto font-semibold">
              {orderDetailData.additional_cost}
            </div>
          </div>

          <hr className="border mb-1"></hr>

          <div className="grid grid-cols-2 mb-1 gap-1">
            <div className="text-xs font-sora font-semibold">Book Status</div>
            {/* Book Status */}

            <div className="text-right text-xs font-roboto font-semibold">
              {orderData.book_status === "canceled" && (
                <div className="text-red-500">{orderData.book_status}</div>
              )}
              {(orderData.book_status === "booked" ||
                orderData.book_status === "done") && (
                <div className="text-green-500">{orderData.book_status}</div>
              )}
              {orderData.book_status === "rescheduled" && (
                <div className="text-blue-500">{orderData.book_status}</div>
              )}
            </div>

            <div className="text-xs font-sora font-semibold">
              Payment Status
            </div>
            {/* Book Status */}
            <div className="text-right text-xs font-roboto font-semibold">
              {(orderData.transactions.payment_status === "refund" ||
                orderData.transactions.payment_status === "refund 50%") && (
                <div className="text-red-500">
                  {orderData.transactions.payment_status}
                </div>
              )}
              {orderData.transactions.payment_status === "unpaid" && (
                <div className="text-red-500">
                  {orderData.transactions.payment_status}
                </div>
              )}
              {orderData.transactions.payment_status === "pending" && (
                <div className="text-orange-500">
                  {orderData.transactions.payment_status}
                </div>
              )}
              {orderData.transactions.payment_status === "paid" && (
                <div className="text-green-500">
                  {orderData.transactions.payment_status}
                </div>
              )}
            </div>
          </div>
        </div>

        <ClipboardCopyLink
          copyLink={orderData.transactions.checkout_url}
          onFinish={(message, color) => {
            finishModal(message, color);
          }}
        />
      </div>
    </div>
  );
};

export default ModalOrderDetail;
