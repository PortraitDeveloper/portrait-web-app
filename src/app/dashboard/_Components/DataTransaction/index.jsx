/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import OptionEditOrder from "../_ChildComponents/OptionEditOrder";
import dateConversion from "@/utils/dateConversion";

const DataTransaction = ({
  ordersData,
  loading,
  dataAvailable,
  getOrderDetail,
  getChangeOrder,
  getCustomerDetail,
  getRefund,
}) => {
  return (
    <>
      {loading && dataAvailable && (
        <div className="text-sm px-4 py-2 w-full">
          <table className="min-w-full">
            <thead className="border-b border-blue-900">
              <tr>
                <th className="py-2">CUSTOMER</th>
                <th className="hidden md:table-cell py-2">CONTACT</th>
                <th className="hidden lg:table-cell py-2">STATUS</th>
                <th className="py-2">BOOKING</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {ordersData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="py-2">
                    <div className="font-semibold">{data.book_code}</div>
                    <div>{data.customers.cust_name}</div>
                  </td>
                  <td className="hidden md:table-cell py-2">
                    <div>{data.customers.email}</div>
                    <div>{data.customers.phone_number}</div>
                  </td>
                  <td className="hidden lg:table-cell py-2">
                    {data.book_status === "canceled" && (
                      <div className="bg-red-50 border border-red-500 rounded-xl text-red-500 mb-2">
                        {data.book_status}
                      </div>
                    )}
                    {(data.book_status === "booked" ||
                      data.book_status === "done") && (
                      <div className="bg-green-50 border border-green-500 rounded-xl text-green-500 mb-2">
                        {data.book_status}
                      </div>
                    )}
                    {data.book_status === "rescheduled" && (
                      <div className="bg-blue-50 border border-blue-500 rounded-xl text-blue-500 mb-2">
                        {data.book_status}
                      </div>
                    )}

                    {(data.transactions.payment_status === "refund" ||
                      data.transactions.payment_status === "refund 50%") && (
                      <div className="bg-red-50 border border-red-500 rounded-xl text-red-500">
                        {data.transactions.payment_status}
                      </div>
                    )}
                    {data.transactions.payment_status === "unpaid" && (
                      <div className="bg-red-50 border border-red-500 rounded-xl text-red-500">
                        {data.transactions.payment_status}
                      </div>
                    )}
                    {data.transactions.payment_status === "paid" && (
                      <div className="bg-green-50 border border-green-500 rounded-xl text-green-500">
                        {data.transactions.payment_status}
                      </div>
                    )}
                    {data.transactions.payment_status === "pending" && (
                      <div className="bg-orange-50 border border-orange-500 rounded-xl text-orange-500">
                        {data.transactions.payment_status}
                      </div>
                    )}
                  </td>
                  <td className="py-2 font-semibold">
                    <div>{dateConversion(data.booking_date)}</div>
                    <div>{data.start_at}</div>
                  </td>
                  <td className="py-2">
                    <div className="flex justify-center">
                      <OptionEditOrder
                        data={data}
                        onOrderDetail={(e) => {
                          getOrderDetail(e);
                        }}
                        onChangeOrder={(e) => {
                          getChangeOrder(e);
                        }}
                        onCustomerDetail={(e) => {
                          getCustomerDetail(e);
                        }}
                        onRefund={(e) => {
                          getRefund(e);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DataTransaction;
