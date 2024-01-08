/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import EditOption from "../_ChildComponents/EditOption";

const DataProduct = ({
  productsData,
  loading,
  dataAvailable,
  getEdit,
  getDelete,
}) => {
  const onEdit = (productData) => {
    getEdit(productData);
  };

  const onDelete = (productData) => {
    getDelete(productData);
  };

  return (
    <>
      {!loading && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      {loading && !dataAvailable && (
        <div className="flex items-center justify-center text-red-500">
          Data tidak ditemukan
        </div>
      )}

      {loading && dataAvailable && (
        <div className="text-sm w-full">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 border-b border-gray-400">ID</th>
                <th className="py-3 border-b border-gray-400">PRODUCT NAME</th>
                <th className="hidden sm:table-cell py-3 border-b border-gray-400">
                  PRICE
                </th>
                <th className="hidden sm:table-cell py-3 border-b border-gray-400">
                  DESCRIPTION
                </th>
                <th className="hidden sm:table-cell py-3 border-b border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((data, index) => (
                <tr key={index}>
                  <td className="text-center py-3 border-b border-gray-400">
                    {data.product_id}
                  </td>
                  <td className="text-center py-3 border-b border-gray-400 w-1/4">
                    {data.product_name}
                  </td>
                  <td className="text-center hidden sm:table-cell py-3 border-b border-gray-400">
                    {data.product_price}
                  </td>
                  <td className="text-center hidden sm:table-cell py-3 border-b border-gray-400 w-1/2">
                    {data.product_desc}
                  </td>
                  <td className="py-3 border-b border-gray-400">
                    <div className="flex justify-center">
                      <EditOption
                        productData={{
                          productId: data.product_id,
                          productName: data.product_name,
                          productPrice: data.product_price,
                          productDesc: data.product_desc,
                          branchId: data.branchId,
                        }}
                        getEdit={(productData) => {
                          onEdit(productData);
                        }}
                        getDelete={(productData) => {
                          onDelete(productData);
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

export default DataProduct;