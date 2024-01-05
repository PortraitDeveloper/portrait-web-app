/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";

const DataProduct = ({ branchid, keyword, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [productData, setProductData] = useState([]);

  const getData = async () => {
    let response = await fetch(
      `/api/data/product/search/${branchid}/${keyword}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    response = await response.json();

    if (response.status === 404) {
      setLoading(true);
      setDataAvailable(false);
      return;
    } else {
      setProductData(response.data);
      setLoading(true);
      setDataAvailable(true);
    }
  };
  useEffect(() => {
    getData();
  }, [branchid, keyword, refresh]);

  return (
    <>
      {!loading && !dataAvailable && (
        <div className="flex items-center justify-center">Loading...</div>
      )}

      {loading && !dataAvailable && (
        <div className="flex items-center justify-center">Data not found !</div>
      )}

      {loading && dataAvailable && (
        <div className="text-sm w-full">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-3 border-b border-slate-300">ID</th>
                <th className="py-3 border-b border-slate-300">PRODUCT NAME</th>
                <th className="hidden sm:table-cell py-3 border-b border-slate-300">
                  PRICE
                </th>
                <th className="hidden sm:table-cell py-3 border-b border-slate-300">
                  DESCRIPTION
                </th>
                <th className="hidden sm:table-cell py-3 border-b border-slate-300"></th>
              </tr>
            </thead>
            <tbody>
              {productData.map((data, index) => (
                <tr key={index}>
                  <td className="text-center py-3 border-b border-slate-300">
                    {data.product_id}
                  </td>
                  <td className="text-center py-3 border-b border-slate-300 w-1/4">
                    {data.product_name}
                  </td>
                  <td className="text-center hidden sm:table-cell py-3 border-b border-slate-300">
                    {data.product_price}
                  </td>
                  <td className="text-center hidden sm:table-cell py-3 border-b border-slate-300 w-1/2">
                    {data.product_desc}
                  </td>
                  <td className="py-3 border-b border-slate-300">
                    <div className="flex justify-center">
                      <button className="border border-blue-900 rounded-3xl px-6 py-2 text-blue-900 text-sm hover:bg-blue-900 hover:text-white">
                        Edit
                      </button>
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
