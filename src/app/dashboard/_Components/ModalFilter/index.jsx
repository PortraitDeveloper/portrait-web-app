/* eslint-disable @next/next/no-img-element */
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";
import FilterDateRange from "../FilterDateRange";
import FilterBranch from "../FilterBranch";
import FilterBook from "../FilterBook";
import FilterPayment from "../FilterPayment";
import ButtonSubmit from "../_ChildComponents/ButtonSubmit";

const ModalFilter = ({
  isVisible,
  branchesData,
  getDateRanges,
  getBranchId,
  getBookStatus,
  getPaymentStatus,
  closeModal,
}) => {
  const handleDateRange = (e) => {
    getDateRanges(e);
  };

  const handleBranchId = (e) => {
    getBranchId(e);
  };

  const handleBookStatus = (e) => {
    getBookStatus(e);
  };

  const handlePaymentStatus = (e) => {
    getPaymentStatus(e);
  };

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      closeModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      id="container"
      onClick={closeHandler}
      className="fixed inset-0 bg-white md:bg-black md:bg-opacity-30 backdrop-blur-sm flex justify-center md:justify-end"
    >
      <div className="bg-white p-6 md:rounded-l-2xl flex flex-col justify-between">
        <div className="w-72 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-5">
            <Title title={"Filters"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>

          <FilterDateRange
            getDateRanges={(ranges) => {
              handleDateRange([ranges.selection]);
            }}
          />

          <FilterBranch
            branchesData={branchesData}
            getBranchId={(e) => {
              handleBranchId(e);
            }}
          />
          <FilterBook
            getBookStatus={(e) => {
              handleBookStatus(e);
            }}
          />
          <FilterPayment
            getPaymentStatus={(e) => {
              handlePaymentStatus(e);
            }}
          />
        </div>
        <ButtonSubmit label={"Apply"} getSubmit={closeModal} />
      </div>
    </div>
  );
};

export default ModalFilter;
