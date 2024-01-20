import thousandConversion from "@/utils/thousandConversion";

const Label = ({ voucherCode, voucherType, voucherDiscount }) => {
  return (
    <div>
      {voucherType === "percentage" && (
        <div className="bg-slate-200 rounded-2xl text-center font-semibold px-3 py-2.5 w-72 mb-5">
          <p>{voucherCode}</p>
          <p>{`Discount ${voucherDiscount * 100}%`}</p>
        </div>
      )}

      {voucherType === "nominal" && (
        <div className="bg-slate-200 rounded-2xl text-center font-semibold px-3 py-2.5 w-72 mb-5">
          <p>{voucherCode}</p>
          <p>{`Discount Rp ${voucherDiscount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</p>
        </div>
      )}
    </div>
  );
};

export default Label;
