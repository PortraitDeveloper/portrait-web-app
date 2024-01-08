/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

const PagePagination = ({
  perPage,
  pageNumber,
  getPerPage,
  getPageNumber,
  productsData,
  getProductsSorted,
}) => {
  const [perPage_, setPerPage_] = useState(perPage);
  const [pageNumber_, setPageNumber_] = useState(pageNumber);
  const [totalPage, setTotalPage] = useState("");

  useEffect(() => {
    getPerPage(perPage);
    getPageNumber(pageNumber);
    const totalPage = Math.ceil(productsData.length / perPage);
    setTotalPage(totalPage);

    const productsSorted = paginate(productsData, perPage, pageNumber);
    getProductsSorted(productsSorted);
  }, [perPage, pageNumber]);

  const paginate = (productsData, perPage, pageNumber) => {
    --pageNumber; // Adjust to 0-based index
    const startIndex = pageNumber * perPage;
    const endIndex = startIndex + perPage;
    return productsData.slice(startIndex, endIndex);
  };

  const changeHandler = (e) => {
    const _perPage = e.target.value;
    setPerPage_(_perPage);
    getPerPage(_perPage);
  };

  const prevHandler = () => {
    const _pageNumber = pageNumber <= 1 ? pageNumber : pageNumber - 1;
    setPageNumber_(_pageNumber);
    getPageNumber(_pageNumber);
  };

  const nextHandler = () => {
    const _pageNumber = pageNumber >= totalPage ? pageNumber : pageNumber + 1;
    setPageNumber_(_pageNumber);
    getPageNumber(_pageNumber);
  };

  return (
    <div className="flex justify-between pl-6 pr-10">
      <div className="flex justify-start gap-3 ">
        <input
          id="perPage"
          name="perPage"
          value={perPage_}
          className="rounded-lg border border-black w-10 text-center"
          onChange={changeHandler}
        />
        <p className="text-sm text-sora">per page</p>
      </div>

      <div className="flex text-sm text-center text-blue-900 gap-3">
        <button
          className="border border-blue-900 rounded-lg px-1 hover:bg-blue-900 hover:text-white"
          onClick={prevHandler}
        >
          Prev
        </button>
        <p>
          {pageNumber_} / {totalPage}
        </p>
        <button
          className="border border-blue-900 rounded-lg px-1 hover:bg-blue-900 hover:text-white"
          onClick={nextHandler}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PagePagination;
