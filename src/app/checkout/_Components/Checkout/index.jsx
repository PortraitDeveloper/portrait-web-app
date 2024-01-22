/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

export default function Checkout({
  getHandleTransaction,
  orderBook,
  countdown,
}) {
  return (
    <div className="flex flex-col items-center md:py-4">
      <div className="md:border-2 md:border-blue-900 rounded-3xl p-6 w-full md:w-128">
        {/* TPP Logo */}
        <Image
          src="/portraitPlace.png"
          width={100}
          height={50}
          alt="The Portrait Place Logo"
          className="mb-3"
        />

        {/* Main Title */}
        <h1 className="text-xl font-sora font-bold mb-4">Ringkasan Pesanan</h1>

        {/* Warning-1 */}
        <div className="rounded-2xl flex justify-center items-center bg-blue-50 border border-blue-900 text-blue-900 text-xs font-roboto font-bold px-3 py-2 mb-4">
          <div>
            Mohon Maaf, kamu sudah tidak dapat mengubah pesanan, karena
            pesananmu sudah dalam proses! Tetapi tenang saja, jika ingin
            mengubah pesanan dapat dilakukan saat hari kedatangan.
          </div>
        </div>

        {/* Booking Detail */}
        <div className="grid grid-cols-2 font-roboto">
          <div className="text-md">Kode Booking</div>
          {/* Book Code */}
          <div className="text-right text-xs font-bold pt-1">
            {orderBook.book_code}
          </div>
          <div className="text-md">Lokasi</div>
          {/* Branch Address */}
          <div className="text-right text-xs pt-1">
            {orderBook.branch_address}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-rows-2 font-roboto mb-4">
          <div className="text-md">Tanggal dan Waktu</div>
          <div className="flex justify-end">
            {/* Booking Date */}
            <div className="text-xs text-right pt-1">
              {orderBook.booking_date}
            </div>
            <div className="text-xs pl-2 xs:block hidden">
              <div className="flex justify-end">
                <span className="bg-blue-900 rounded-xl text-white text-xs flex justify-center items-center p-2">
                  <img
                    src="/clock.png"
                    alt="Clock Icon"
                    className="max-w-full h-auto rounded-full"
                  />
                  {/* Start At */}
                  <p className="pl-1">{orderBook.start_at} WIB</p>
                </span>
              </div>
            </div>
          </div>
          <div className="xs:hidden"></div>
          <div className="xs:hidden text-xs">
            <div className="flex justify-end">
              <span className="bg-blue-900 rounded-md text-white text-xs flex justify-center item-center px-2 py-1">
                <img
                  src="/clock.png"
                  alt="Clock Icon"
                  className="max-w-full h-auto rounded-full"
                />
                {/* Start At */}
                <p className="pl-1">{orderBook.start_at} WIB</p>
              </span>
            </div>
          </div>
        </div>

        <hr className="border mb-4"></hr>

        {/* Product */}
        <div className="grid grid-cols-2 grid-rows-3 mb-4">
          <div className="text-md font-sora font-bold">Paket</div>
          <div></div>
          {/* Product Name */}
          <div className="text-md font-roboto">{orderBook.product_name}</div>
          {/* Product Price */}
          <div className="text-right text-xs font-roboto font-bold">
            {orderBook.product_price}
          </div>
          {/* Product Type */}
          <div className="text-xs text-slate-400 font-roboto italic">
            {orderBook.product_type}
          </div>
          <div></div>
        </div>

        <hr className="border mb-4"></hr>

        {/* Additional */}
        <div className="grid grid-cols-2 grid-rows-9 mb-4">
          <div className="text-md font-sora font-bold">Tambahan</div>
          <div></div>

          {/* Person */}
          <div className="text-md font-roboto">Orang Dewasa</div>
          <div></div>
          {/* Number of Add Person */}
          <div className="text-xs text-slate-400 font-roboto">
            {orderBook.number_of_add_person}
          </div>
          {/* Additional Person Price */}
          <div className="text-right text-xs font-roboto font-bold">
            {orderBook.additional_person_price}
          </div>

          {/* Pet */}
          <div className="text-md font-roboto">Hewan Peliharaan</div>
          <div></div>
          {/* Number of Add Pet */}
          <div className="text-xs text-slate-400 font-roboto">
            {orderBook.number_of_add_pet}
          </div>
          {/* Additional Pet Price */}
          <div className="text-right text-xs font-roboto font-bold">
            {orderBook.additional_pet_price}
          </div>

          {/* Print5R */}
          <div className="text-md font-roboto">Print 5R</div>
          <div></div>
          {/* Number of Add Print5R */}
          <div className="text-xs text-slate-400 font-roboto">
            {orderBook.number_of_add_print5r}
          </div>
          {/* Additional Print5R Price */}
          <div className="text-right text-xs font-roboto font-bold">
            {orderBook.additional_print5r_price}
          </div>

          {/* Soft-File */}
          <div className="text-md font-roboto">Soft-File</div>
          <div></div>
          {/* Number of Add Softfile */}
          <div className="text-xs text-slate-400 font-roboto">
            {orderBook.number_of_add_softfile}
          </div>
          {/* Additional Softfile Price */}
          <div className="text-right text-xs font-roboto font-bold">
            {orderBook.additional_softfile_price}
          </div>
        </div>

        <hr className="border mb-4"></hr>

        <div className="grid grid-cols-2 grid-rows-3 mb-4">
          <div className="text-md font-sora font-bold">Subtotal</div>
          {/* Total Price */}
          <div className="text-right text-xs font-roboto font-bold pt-1">
            {orderBook.total_price}
          </div>

          <div className="text-md font-roboto ">Kode Voucher</div>
          {/* Voucher Code */}
          <div className="text-right text-xs text-blue-900 font-roboto font-bold pt-1">
            {orderBook.voucher_code}
          </div>
          <div></div>
          {/* Discount */}
          <div className="text-right text-xs text-green-500 font-roboto font-bold pt-1">
            {orderBook.discount}
          </div>
        </div>

        <hr className="border mb-4"></hr>

        <div className="grid grid-cols-2 mb-4">
          <div className="text-md font-sora font-bold">Total</div>
          {/* Total */}
          <div className="text-right text-xs font-roboto font-bold pt-1">
            {orderBook.total_paid_by_cust}
          </div>
        </div>

        {/* Warning-2 */}
        <div className="rounded-2xl flex justify-between items-center bg-red-50 border border-red-600 text-xs text-red-600 font-bold font-roboto px-3 py-2 mb-4">
          <div>Segera lakukan pembayaran sebelum</div>
          <div>{`${countdown.minutes} Menit ${countdown.seconds} Detik`}</div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center items-center">
          <button
            className="bg-blue-900 text-sm font-bold text-white font-poppins hover:bg-blue-700 rounded-xl w-full md:w-120 h-10"
            onClick={getHandleTransaction}
          >
            Pilih Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
