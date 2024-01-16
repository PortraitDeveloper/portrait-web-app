/* eslint-disable @next/next/no-img-element */
import Title from "../_ChildComponents/Title";
import CloseIcon from "../_ChildComponents/CloseIcon";

const ModalChangeOrder = ({
  orderData,
  isVisible,
  closeModal,
  finishModal,
}) => {
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
        <div className="w-72">
          <div className="flex justify-between items-center mb-5">
            <Title title={"Change Order"} />
            <CloseIcon
              onClose={() => {
                closeModal();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChangeOrder;
