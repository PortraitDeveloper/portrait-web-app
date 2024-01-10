/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import EditOption from "../_ChildComponents/EditOption";

const DataProduct = ({
  title,
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
      {loading && dataAvailable && (
        <div className="text-sm text-center px-4 py-2 w-full">
          <table className="min-w-full">
            <thead className="border-b border-blue-900">
              <tr>
                <th className="py-3">
                  ID
                </th>
                <th className="py-3 w-32 md:w-1/4">
                  PRODUCT_NAME
                </th>
                <th className="py-3">
                  PRICE
                </th>
                <th className="hidden md:table-cell py-3 w-1/3 lg:w-1/2">
                  DESCRIPTION
                </th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="py-3">
                    {data.product_id}
                  </td>
                  <td className="py-3 w-32 md:w-1/4">
                    {data.product_name}
                  </td>
                  <td className="py-3">
                    {data.product_price}
                  </td>
                  <td className="hidden md:table-cell py-3 w-1/3 lg:w-1/2">
                    {data.product_desc}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-center">
                      <EditOption
                        title={title}
                        data={{
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
