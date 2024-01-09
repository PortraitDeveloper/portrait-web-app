/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import paginate from "@/utils/paginate";

const PagePagination = ({
  loading,
  dataAvailable,
  perPage,
  pageNumber,
  totalPage,
  data,
  getPerPage,
  getPageNumber,
  getDataSorted,
}) => {
  const [perPage_, setPerPage_] = useState(perPage);
  const [pageNumber_, setPageNumber_] = useState(pageNumber);
  const [totalPage_, setTotalPage_] = useState(totalPage);

  useEffect(() => {
    const perPage_ = !perPage ? 1 : perPage;
    let _totalPage = Math.ceil(data.length / perPage_);
    setTotalPage_(_totalPage);

    const dataSorted = paginate(data, perPage, pageNumber);
    getDataSorted(dataSorted);
  }, [perPage, pageNumber, data]);

  useEffect(() => {
    if (totalPage_ < pageNumber_) {
      setTotalPage_(1);
      setPageNumber_(1);
      getPageNumber(1);
    }
  }, [totalPage_, pageNumber_]);

  const changeHandler = (e) => {
    const _perPage = parseInt(e.target.value) === 0 ? 1 : e.target.value;
    setPerPage_(_perPage);
    getPerPage(_perPage);
  };

  const prevHandler = () => {
    const _pageNumber = pageNumber <= 1 ? pageNumber : pageNumber - 1;
    setPageNumber_(_pageNumber);
    getPageNumber(_pageNumber);
  };

  const nextHandler = () => {
    const _pageNumber = pageNumber >= totalPage_ ? pageNumber : pageNumber + 1;
    setPageNumber_(_pageNumber);
    getPageNumber(_pageNumber);
  };

  return (
    <>
      {loading && dataAvailable && (
        <div className="flex justify-between px-6">
          <div className="flex justify-start gap-3 ">
            <input
              type="number"
              value={perPage_}
              className="rounded-lg border border-black w-12 text-center"
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
              {pageNumber_} / {totalPage_}
            </p>
            <button
              className="border border-blue-900 rounded-lg px-1 hover:bg-blue-900 hover:text-white"
              onClick={nextHandler}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PagePagination;
