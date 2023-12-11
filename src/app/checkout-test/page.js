/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

export default function Checkout() {
  return (
    <>
      <div className="flex justify-center items-center py-4">
        <div className="border-2 border-blue-900 rounded-3xl p-6 w-128">
          {/* The Portrait Place Logo*/}
          <Image
            src="/portraitPlace.png"
            width={100}
            height={50}
            alt="The Portrait Place Logo"
            className="mb-3"
          />

          {/* Title */}
          <h1 className="text-xl font-sora font-bold mb-4">
            Ringkasan Pesanan
          </h1>

          {/* Warning-1 */}
          <div
            role="alert"
            className="alert p-1 mb-4 border border-blue-900 text-blue-900 text-xs font-roboto font-bold bg-blue-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Mohon Maaf, kamu sudah tidak dapat mengubah pesanan, karena
              pesananmu sudah dalam proses! Tetapi tenang saja, jika ingin
              mengubah pesanan dapat dilakukan saat hari kedatangan.
            </span>
          </div>

          {/* Booking Detail */}
          <div className="grid grid-cols-2 grid-rows-2 font-roboto">
            <div className="text-md">Kode Booking</div>
            <div className="text-right text-xs font-bold pt-1">
              XRUX-SSVJ-ZSSQ
            </div>
            <div className="text-md">Lokasi</div>
            <div className="text-right text-xs pt-1">
              Jl. Braga No. 43 (Stoker House)
            </div>
          </div>

          <div className="grid grid-cols-2 font-roboto mb-4">
            <div className="text-md">Tanggal dan Waktu</div>
            <div className="text-right text-xs">
              <div className="flex justify-end">
                <p className="pr-2 pt-1">15 November 2023</p>
                <span className="bg-blue-800 rounded-md text-white text-xs flex justify-center item-center p-1">
                  <Image
                    src="/clock.png"
                    width={20}
                    height={10}
                    alt="The Portrait Place Logo"
                    className="rounded-full"
                  />
                  <p className="pl-1">17:30 WIB</p>
                </span>
              </div>
            </div>
          </div>

          <hr className="border mb-4"></hr>

          {/* Product */}
          <div className="grid grid-cols-2 grid-rows-3 mb-4">
            {/* Title */}
            <div className="text-md font-sora font-bold">Paket</div>
            <div></div>

            {/* Product Name and Price */}
            <div className="text-md font-roboto">Portrait Shoot</div>
            <div></div>
            <div className="text-xs text-slate-400 font-roboto italic">
              Black and White
            </div>
            <div className="text-right text-xs font-roboto">Rp.80,000</div>
          </div>

          <hr className="border mb-4"></hr>

          {/* Additional */}
          <div className="grid grid-cols-2 grid-rows-9 mb-4">
            {/* Title */}
            <div className="text-md font-sora font-bold">Tambahan</div>
            <div></div>

            {/* Adult */}
            <div className="text-md font-roboto">Orang Dewasa</div>
            <div></div>
            <div className="text-xs text-slate-400 font-roboto">1x</div>
            <div className="text-right text-xs font-roboto">Rp.30,000</div>

            {/* Pet */}
            <div className="text-md font-roboto">Hewan Peliharaan</div>
            <div></div>
            <div className="text-xs text-slate-400 font-roboto">1x</div>
            <div className="text-right text-xs font-roboto">Rp.15,000</div>

            {/* Print5R */}
            <div className="text-md font-roboto">Print 5R</div>
            <div></div>
            <div className="text-xs text-slate-400 font-roboto">1x</div>
            <div className="text-right text-xs font-roboto">Rp.20,000</div>

            {/* Soft-File */}
            <div className="text-md font-roboto">Soft-File</div>
            <div></div>
            <div className="text-xs text-slate-400 font-roboto">1x</div>
            <div className="text-right text-xs font-roboto">Rp.50,000</div>
          </div>

          <hr className="border mb-4"></hr>

          {/* Sub-Total */}
          <div className="grid grid-cols-2 grid-rows-3 mb-4">
            {/* Title */}
            <div className="text-md font-sora font-bold">Subtotal</div>
            <div className="text-right text-xs font-roboto font-bold pt-1">
              Rp.195,000
            </div>

            {/* Voucher */}
            <div className="text-md font-roboto ">Kode Voucher</div>
            <div className="text-right text-xs text-blue-900 font-roboto font-bold pt-1">
              XYZ7772
            </div>
            <div></div>
            <div className="text-right text-xs text-green-500 font-roboto pt-1">
              -Rp.15,000
            </div>
          </div>

          <hr className="border mb-4"></hr>

          {/* Total */}
          <div className="grid grid-cols-2 mb-4">
            <div className="text-md font-sora font-bold">Total</div>
            <div className="text-right text-xs font-roboto font-bold pt-1">
              Rp.180,000
            </div>
          </div>

          {/* Warning-2 */}
          <div
            role="alert"
            className="alert p-1 mb-2 border border-red-600 text-xs text-red-600 font-roboto bg-red-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              <div className="grid grid-cols-2 text-xs font-roboto font-bold">
                <div>Segera lakukan pembayaran sebelum</div>
                <div className="text-right">14 Menit 30 Detik</div>
              </div>
            </span>
          </div>

          {/* Button */}
          <div className="flex justify-center items-center">
            <button className="bg-blue-900 text-sm font-bold text-white font-poppins hover:bg-blue-700 rounded-xl w-120 h-10">
              Pilih Pembayaran
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
