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
        <div className="text-sm text-center px-4 py-2 w-full">
          <table className="min-w-full">
            <thead className="border-b border-blue-900">
              <tr>
                <th className="px-2 py-2">
                  ID
                </th>
                <th className="px-2 py-2">
                  ITEM_NAME
                </th>
                <th className="px-2 py-2">
                  PRICE
                </th>
                <th className="hidden md:table-cell px-2 py-2">
                  DESCRIPTION
                </th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {additionalsData.map((data, index) => (
                <tr key={index} className="border-b border-blue-900">
                  <td className="px-2 py-2">
                    {data.item_id}
                  </td>
                  <td className="px-2 py-2">
                    {data.item_name}
                  </td>
                  <td className="px-2 py-2">
                    {data.item_price}
                  </td>
                  <td className="hidden md:table-cell px-2 py-2">
                    {data.item_desc}
                  </td>
                  <td className="flex justify-center px-2 py-2">
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
