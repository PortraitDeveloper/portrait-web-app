import Image from "next/image";

export default function Checkout() {
  return (
    <>
      <div className="flex flex-col items-center py-4">
        <div className="md:border-2 md:border-blue-900 rounded-3xl p-6 w-full md:w-120">
          {/* Title */}
          <h1 className="text-2xl font-sora font-bold mb-2">
            Konfirmasi Pembayaran
          </h1>

          {/* Booking Detail */}
          <div className="grid grid-cols-2 grid-rows-4 mb-2">
            <div className="text-md">Kode Booking</div>
            <div className="text-right text-xs font-bold pt-1">
              XRUX-SSVJ-ZSSQ
            </div>
            <div className="text-md">Lokasi</div>
            <div className="text-right text-xs pt-1">
              Jl. Braga No. 43 (Stoker House)
            </div>
            <div className="text-md">Tanggal</div>
            <div className="text-right text-xs pt-1">
              13 Desember 2023
            </div>
            <div className="text-md">Pukul</div>
            <div className="text-right text-xs pt-1">
              15:00 WIB
            </div>
          </div>

          <hr className="border mb-2"></hr>

          {/* Product */}
          <div className="grid grid-cols-2 grid-rows-3 mb-2">
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

          <hr className="border mb-2"></hr>

          {/* Additional */}
          <div className="grid grid-cols-2 grid-rows-9 mb-2">
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

          <hr className="border mb-2"></hr>

          {/* Sub-Total */}
          <div className="grid grid-cols-2 grid-rows-3 mb-2">
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

          <hr className="border mb-2"></hr>

          {/* Total */}
          <div className="grid grid-cols-2 mb-2">
            <div className="text-md font-sora font-bold">Total</div>
            <div className="text-right text-xs font-roboto font-bold pt-1">
              Rp.180,000
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center items-center">
            <button className="bg-blue-900 text-sm font-bold text-white font-poppins hover:bg-blue-700 rounded-xl w-full md:w-120 h-10">
              Link Pembayaran
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
