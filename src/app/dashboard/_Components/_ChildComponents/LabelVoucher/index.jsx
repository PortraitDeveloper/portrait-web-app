import thousandConversion from "@/utils/thousandConversion";

const Label = ({ voucherCode, voucherType, voucherDiscount }) => {
  return (
    <div>
      {voucherType === "percentage" && (
        <div className="bg-slate-200 rounded-2xl font-bold px-3 py-2.5 w-72 mb-5">
          <p>{`Voucher Code: ${voucherCode}`}</p>
          <p>{`Discount: ${voucherDiscount * 100}%`}</p>
        </div>
      )}

      {voucherType === "nominal" && (
        <div className="bg-slate-200 rounded-2xl font-bold px-3 py-2.5 w-72 mb-5">
          <p>{`Voucher Code: ${voucherCode}`}</p>
          <p>{`Discount: ${voucherDiscount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} IDR`}</p>
        </div>
      )}
    </div>
  );
};

export default Label;
