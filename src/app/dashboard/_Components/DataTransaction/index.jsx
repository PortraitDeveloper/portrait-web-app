/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import EditOption from "../_ChildComponents/EditOption";

const DataTransaction = ({
  title,
  transactionsData,
  loading,
  dataAvailable,
  getEdit,
  getDelete,
}) => {
  const onEdit = (e) => {
    getEdit(e);
  };

  const onDelete = (e) => {
    getDelete(e);
  };

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
                <th className="py-2">BOOK_START</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {transactionsData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="py-2">
                    <div className="font-semibold">{data.book_code}</div>
                    <div>{data.customers.cust_name}</div>
                  </td>
                  <td className="hidden md:table-cell py-2">
                    <div>{data.customers.phone_number}</div>
                    <div>{data.customers.email}</div>
                  </td>
                  <td className="hidden lg:table-cell py-2">
                    {data.book_status === "canceled" && (
                      <div className="bg-red-50 border border-red-500 rounded-xl text-red-500 mb-2">
                        {data.book_status}
                      </div>
                    )}
                    {data.book_status === "booked" && (
                      <div className="bg-green-50 border border-green-500 rounded-xl text-green-500 mb-2">
                        {data.book_status}
                      </div>
                    )}
                    {data.book_status === "rescheduled" && (
                      <div className="bg-blue-50 border border-blue-500 rounded-xl text-blue-500 mb-2">
                        {data.book_status}
                      </div>
                    )}

                    {data.transactions.payment_status === "refund" && (
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
                  <td className="py-2 font-semibold">{data.start_at}</td>
                  <td className="py-2">
                    <div className="flex justify-center">
                      <EditOption
                        title={title}
                        data={{
                          transactionId: data.transaction_id,
                          transactionName: data.transaction_name,
                          transactionPrice: data.transaction_price,
                          transactionDesc: data.transaction_desc,
                          branchId: data.branchId,
                        }}
                        getEdit={(transactionData) => {
                          onEdit(transactionData);
                        }}
                        getDelete={(transactionData) => {
                          onDelete(transactionData);
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
