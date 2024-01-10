/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import ButtonEdit from "../_ChildComponents/ButtonEdit/page";

const DataAdditional = ({
  additionalsData,
  loading,
  dataAvailable,
  getEdit,
}) => {
  const onEdit = (additionalData) => {
    getEdit(additionalData);
  };

  return (
    <>
      {loading && dataAvailable && (
        <div className="text-sm w-full">
          <table className="min-w-full">
            <thead className="border-b border-blue-900">
              <tr>
                <th className="py-3 text-sm md:text-md">
                  ID
                </th>
                <th className="py-3 text-sm md:text-md w-32 md:w-1/4">
                  ITEM_NAME
                </th>
                <th className="py-3 text-sm md:text-md">
                  PRICE
                </th>
                <th className="hidden md:table-cell py-3 text-md w-1/3 lg:w-1/2">
                  DESCRIPTION
                </th>
                <th className="py-3 ">EDIT</th>
              </tr>
            </thead>
            <tbody>
              {additionalsData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="text-center py-3">
                    {data.item_id}
                  </td>
                  <td className="text-center py-3 w-32 md:w-1/4">
                    {data.item_name}
                  </td>
                  <td className="text-center py-3">
                    {data.item_price}
                  </td>
                  <td className="hidden md:table-cell py-3 w-1/3 lg:w-1/2">
                    {data.item_desc}
                  </td>
                  <td className="flex justify-center py-3">
                    <ButtonEdit
                      data={{
                        itemId: data.item_id,
                        itemName: data.item_name,
                        itemPrice: data.item_price,
                        itemDesc: data.item_desc,
                      }}
                      getEdit={(additionalsData) => {
                        onEdit(additionalsData);
                      }}
                    />
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

export default DataAdditional;
