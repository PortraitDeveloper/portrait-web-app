import Image from "next/image";

const ModalOrderDetail = () => {
  return (
    <div className="card">
      {/* TPP Logo */}
      <Image
        src="https://i.ibb.co/7V2BYcv/portrait-Place.png"
        alt="The Portrait Place Logo"
        className="rounded-10"
      />

      {/* Main Title */}
      <h1 className="text-xl font-bold mb-4">Konfirmasi Pembayaran</h1>

      <div className="flex mb-2">
        {/* Title */}
        <div className="w-1/2 text-md">Kode Booking</div>
        {/* Booking Code */}
        <div className="w-1/2 text-right text-md">{bookCode}</div>
      </div>

      <div className="flex mb-2">
        {/* Title */}
        <div className="w-1/2 text-md">Lokasi</div>
        {/* Branch Address */}
        <div className="w-1/2 text-right text-md">{branchAddress}</div>
      </div>

      {/* ... (the rest of your code) ... */}

      {/* Button */}
      <a href={paymentUrl}>
        <button className="button">Link Pembayaran</button>
      </a>
    </div>
  );
};

export default ModalOrderDetail;
