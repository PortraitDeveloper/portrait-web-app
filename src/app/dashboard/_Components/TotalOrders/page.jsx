const TotalOrders = ({
  totalTransaction,
  totalPaid,
  totalUnpaid,
  totalRefund,
}) => {
  return (
    <>
      <div className="border border-blue-900 rounded-2xl p-2 w-32 lg:w-48">
        <p className="text-sm text-blue-900 font-roboto">Total</p>
        <p className="text-xl text-blue-900 font-sora font-semibold">
          {totalTransaction}
        </p>
      </div>
      <div className="border border-blue-900 rounded-2xl p-2 w-32 lg:w-48">
        <p className="text-sm text-blue-900 font-roboto">Paid</p>
        <p className="text-xl text-blue-900 font-sora font-semibold">
          {totalPaid}
        </p>
      </div>
      <div className="border border-blue-900 rounded-2xl p-2 w-32 lg:w-48">
        <p className="text-sm text-blue-900 font-roboto">Unpaid</p>
        <p className="text-xl text-blue-900 font-sora font-semibold">
          {totalUnpaid}
        </p>
      </div>
      <div className="border border-blue-900 rounded-2xl p-2 w-32 lg:w-48">
        <p className="text-sm text-blue-900 font-roboto">Refund</p>
        <p className="text-xl text-blue-900 font-sora font-semibold">
          {totalRefund}
        </p>
      </div>
    </>
  );
};

export default TotalOrders;
