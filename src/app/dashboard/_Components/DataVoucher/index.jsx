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
                <th className="py-3">CODE</th>
                <th className="py-3">DISCOUNT</th>
                <th className="hidden md:table-cell py-3">START</th>
                <th className="py-3">EXPIRED</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {vouchersData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="py-3">{data.voucher_code}</td>
                  <td className="py-3">
                    {discountType === "percentage"
                      ? (data.percentage_discount * 100).toString() + "%"
                      : (data.nominal_discount * 1)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td className="hidden md:table-cell py-3">
                    {dateConvertion(data.start_date)}
                  </td>
                  <td className="py-3">{dateConvertion(data.expired_date)}</td>
                  <td className="py-3">
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
