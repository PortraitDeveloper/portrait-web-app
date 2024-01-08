/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import SidebarContent from "./Components/SidebarContent";
import Searchbar from "./Components/SearchBar";
import AccountOption from "./Components/AccountOption";
import PageTitle from "./Components/PageTitle";
import FilterBranch from "./Components/FilterBranch";
import AddButton from "./Components/AddButton";
import DataProduct from "./Components/DataProduct";
import ModalAccount from "./Components/ModalAccount";
import ModalProductAdd from "./Components/ModalProductAdd";
import ModalProductEdit from "./Components/ModalProductEdit";
import ModalProductDelete from "./Components/ModalProductDelete";
import Message from "./Components/Message";
import PagePagination from "./Components/PagePagination";

export default function BackofficePage() {
  const pageTitle = "Product";
  const [productsData, setProductsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);
  const [credentialsData, setCredentialsData] = useState([]);
  const [branchId, setBranchId] = useState("all");
  const [keyword, setKeyword] = useState("null");
  const [productData, setProductData] = useState({});
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [productModalAddVisible, setproductModalAddVisible] = useState(false);
  const [productModalEditVisible, setProductModalEditVisible] = useState(false);
  const [productModalDeleteVisible, setProductModalDeleteVisible] =
    useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);

  const [productsSorted, setproductsSorted] = useState({});
  const [perPage, setPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getBranchesData = async () => {
    let response = await fetch(`/api/data/branch`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setBranchesData(response.data);
  };

  const getProductsData = async () => {
    let response = await fetch(
      `/api/data/product/search/${branchId}/${keyword}`,
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
      setDataAvailable(false);
      setLoading(true);
    } else {
      setProductsData(response.data);
      setDataAvailable(true);
      setLoading(true);
    }
  };

  const getCredentialsData = async () => {
    let response = await fetch("/api/credential", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setCredentialsData(response.data);
  };

  useEffect(() => {
    getBranchesData();
  }, []);

  useEffect(() => {
    getProductsData();
  }, [
    branchId,
    keyword,
    productModalAddVisible,
    productModalEditVisible,
    productModalDeleteVisible,
  ]);

  useEffect(() => {
    getCredentialsData();
  }, []);

  const closeAccountModalHandler = () => {
    setAccountModalVisible(false);
  };

  const closeProductModalHandler = () => {
    setproductModalAddVisible(false);
  };

  const closeProductModalEditHandler = () => {
    setProductModalEditVisible(false);
  };

  const closeProductModalDeleteHandler = () => {
    setProductModalDeleteVisible(false);
  };

  const hideMessageHandler = () => {
    setMessage(null);
    setColor("");
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="shadow-xl shadow-gray-400">
        <div className="p-6">
          <SidebarContent />
        </div>
      </div>

      <div className="w-full px-6 py-4">
        <div className="flex justify-center items-center mb-6">
          <Searchbar
            placeholder="Find Product by Name"
            getKeyword={(e) => {
              setKeyword(e);
            }}
          />
          <AccountOption
            credentialsData={credentialsData}
            openModal={() => setAccountModalVisible(true)}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <PageTitle title="Product" />
            <Message
              message={message}
              color={color}
              onHide={hideMessageHandler}
            />

            <div>
              <FilterBranch
                branchesData={branchesData}
                getBranchId={(e) => {
                  setBranchId(e);
                }}
              />

              <AddButton
                title={pageTitle}
                openModal={() => setproductModalAddVisible(true)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border border-black rounded-3xl overflow-auto pb-4 h-3/4">
          <div className="mb-6">
            <div className="flex justify-center p-4">
              {/* <DataProduct
                productsData={productsSorted}
                loading={loading}
                dataAvailable={dataAvailable}
                getEdit={(productData) => {
                  setProductData(productData);
                  setProductModalEditVisible(true);
                }}
                getDelete={(productData) => {
                  setProductData(productData);
                  setProductModalDeleteVisible(true);
                }}
              /> */}
            </div>
          </div>

          <PagePagination
            perPage={perPage}
            pageNumber={pageNumber}
            getPerPage={(e) => {
              setPerPage(e);
              console.log("Per Page:", e);
            }}
            getPageNumber={(e) => {
              setPageNumber(e);
              console.log("Page Number:", e);
            }}
            totalPage={totalPage}
            productsData={productsData}
            getProductsSorted={(e) => {
              setproductsSorted(e);
              console.log("Products Sorted:", e)
            }}
          />
        </div>

        <ModalAccount
          isVisible={accountModalVisible}
          credentialsData={credentialsData}
          closeModal={() => {
            closeAccountModalHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeAccountModalHandler();
          }}
        />

        <ModalProductAdd
          isVisible={productModalAddVisible}
          branchesData={branchesData}
          closeModal={() => {
            closeProductModalHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeProductModalHandler();
          }}
        />

        <ModalProductEdit
          isVisible={productModalEditVisible}
          productData={productData}
          closeModal={() => {
            closeProductModalEditHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeProductModalEditHandler();
          }}
        />

        <ModalProductDelete
          isVisible={productModalDeleteVisible}
          productData={productData}
          closeModal={() => {
            closeProductModalDeleteHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeProductModalDeleteHandler();
          }}
        />
      </div>
    </div>
  );
}
