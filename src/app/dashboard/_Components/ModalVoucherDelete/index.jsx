import { useState } from "react";
import Image from "next/image";
import ButtonCancel from "../_ChildComponents/ButtonCancel";
import ButtonDelete from "../_ChildComponents/ButtonDelete";

const ModalVoucherDelete = ({
  isVisible,
  productData,
  closeModal,
  finishModal,
}) => {
  const [loading, setLoading] = useState(true);
  let message = null;
  let color = "red";

  const closeHandler = (e) => {
    if (e.target.id === "container" || e === "closeIcon") {
      closeModal();
    }
  };

  const deleteHandler = async () => {
    setLoading(false);
    let response = await fetch("/api/data/product", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: productData.productId }),
    });

    response = await response.json();
    setLoading(true);

    if (response.status !== 200) {
      message = `Gagal menghapus product ${productData.productName}`;
      finishModal(message, color);
    } else {
      message = `Product dengan ID ${productData.productId} telah dihapus`;
      finishModal(message, color);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {loading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
          id="container"
          onClick={closeHandler}
        >
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-center items-center mb-6">
              <Image
                src="/warning.png"
                alt="Warning Sign"
                width={40}
                height={40}
              />
            </div>

            <div className="text-center mb-5">
              <div className="text-red-500 font-bold mb-3">
                Apakah kamu yakin
              </div>
              <div className="text-sm">Ingin menghapus produk</div>
              <div className="text-sm font-bold w-56">
                {productData.productName}
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <ButtonCancel
                getCancel={() => {
                  closeModal();
                }}
              />
              <ButtonDelete getDelete={deleteHandler} />
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
          id="container"
          onClick={closeHandler}
        >
          <div className="bg-white p-6 rounded-2xl text-center">
            <p>Process...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalVoucherDelete;
