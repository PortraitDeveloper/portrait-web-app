/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import EditOption from "../_ChildComponents/EditOption";
import dateConvertion from "@/utils/dateConversion";

const DataVoucher = ({
  title,
  vouchersData,
  discountType,
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
        <div className="text-sm text-center px-4 py-2 w-full">
          <table className="min-w-full">
            <thead className="border-b border-blue-900">
              <tr>
                <th className="px-2 py-2">CODE</th>
                <th className="px-2 py-2">DISCOUNT</th>
                <th className="hidden md:table-cell px-2 py-2">START</th>
                <th className="px-2 py-2">EXPIRED</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {vouchersData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="px-2 py-2">{data.voucher_code}</td>
                  <td className="px-2 py-2">
                    {discountType === "percentage"
                      ? (data.percentage_discount * 100).toString() + "%"
                      : (data.nominal_discount * 1)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className="hidden md:table-cell px-2 py-2">
                    {dateConvertion(data.start_date)}
                  </td>
                  <td className="px-2 py-2">
                    {dateConvertion(data.expired_date)}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex justify-center">
                      <EditOption
                        title={title}
                        data={{
                          voucherCode: data.voucher_code,
                          voucherDiscount:
                            discountType === "percentage"
                              ? data.percentage_discount
                              : data.nominal_discount,
                          startDate: data.start_date,
                          expiredDate: data.expired_date,
                        }}
                        getEdit={(e) => {
                          onEdit(e);
                        }}
                        getDelete={(e) => {
                          onDelete(e);
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

export default DataVoucher;
