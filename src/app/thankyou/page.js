import Image from "next/image";

export default function Thankyou() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Image src="/envelope.png" alt="envelope" width={75} height={50} className="mx-auto mb-4"/>
        <h1 className="text-xl font-bold font-mono mb-2 sm:text-2xl sm:mb-3 md:text-3xl md:mb-4">Thanyou for submitting!</h1>
        <p className="text-sm font-semibold font-sans mb-2 sm:text-md sm:mb-3 md:text-lg md:mb-4">your payment confirmation</p>
        <p className="text-sm font-semibold font-sans mb-2 sm:text-md sm:mb-3 md:text-lg md:mb-4">has been sent to your email!</p>
      </div>
    </div>
  );
}
