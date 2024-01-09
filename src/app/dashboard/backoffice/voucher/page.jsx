/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import SidebarContent from "../../_Components/SidebarContent";
import Searchbar from "../../_Components/SearchBar";
import AccountOption from "../../_Components/AccountOption";
import PageTitle from "../../_Components/PageTitle";
import Message from "../../_Components/Message";
import FilterBranch from "../../_Components/FilterBranch";
import AddButton from "../../_Components/AddButton";
import DataProduct from "../../_Components/DataProduct";
import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";
import ModalProductAdd from "../../_Components/ModalProductAdd";
import ModalProductEdit from "../../_Components/ModalProductEdit";
import ModalProductDelete from "../../_Components/ModalProductDelete";
import ModalLoading from "../../_Components/ModalLoading";
const pageTitle = "Voucher";

export default function ProductPage() {
  const [credentialsData, setCredentialsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);

  const [productsData, setProductsData] = useState([]);
  const [productsSorted, setproductsSorted] = useState({});
  const [productData, setProductData] = useState({});

  const [branchId, setBranchId] = useState("all");
  const [keyword, setKeyword] = useState("null");

  const [perPage, setPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");

  const [AccountVisible, setAccountVisible] = useState(false);
  const [productAddVisible, setproductAddVisible] = useState(false);
  const [productEditVisible, setproductEditVisible] = useState(false);
  const [productDeleteVisible, setproductDeleteVisible] = useState(false);

  useEffect(() => {
    getCredentialsData();
  }, []);

  useEffect(() => {
    getBranchesData();
  }, []);

  useEffect(() => {
    getProductsData();
  }, [
    branchId,
    keyword,
    productAddVisible,
    productEditVisible,
    productDeleteVisible,
  ]);

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
      setColor("red");
      setMessage("Data tidak ditemukan");
    } else {
      const _totalPage = Math.ceil(response.data.length / perPage);
      setTotalPage(_totalPage);
      setProductsData(response.data);
      setDataAvailable(true);
      setLoading(true);
      setColor("");
      setMessage(null);
    }
  };

  const closeAccountHandler = () => {
    setAccountVisible(false);
  };

  const closeproductHandler = () => {
    setproductAddVisible(false);
  };

  const closeproductEditHandler = () => {
    setproductEditVisible(false);
  };

  const closeproductDeleteHandler = () => {
    setproductDeleteVisible(false);
  };

  const hideMessageHandler = () => {
    setMessage(null);
    setColor("");
  };

  return (
    <div className="flex justify-center h-screen">
      {!loading && <ModalLoading />}

      <div className="shadow-xl shadow-gray-400">
        <div className="p-6">
          <SidebarContent pageTitle={pageTitle} />
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
            openModal={() => setAccountVisible(true)}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <PageTitle pageTitle={pageTitle} />
            <Message
              message={message}
              color={color}
              onHide={() => {
                setColor("");
                setMessage(null);
                hideMessageHandler();
              }}
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
                openModal={() => setproductAddVisible(true)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border border-black rounded-3xl overflow-auto pb-4 h-3/4">
          <div>
            <div className="flex justify-center px-4 py-2">
              <DataProduct
                productsData={productsSorted}
                loading={loading}
                dataAvailable={dataAvailable}
                getEdit={(productData) => {
                  setProductData(productData);
                  setproductEditVisible(true);
                }}
                getDelete={(productData) => {
                  setProductData(productData);
                  setproductDeleteVisible(true);
                }}
              />
            </div>
          </div>

          <PagePagination
            loading={loading}
            dataAvailable={dataAvailable}
            perPage={perPage}
            pageNumber={pageNumber}
            totalPage={totalPage}
            productsData={productsData}
            getPerPage={(e) => {
              setPerPage(e);
            }}
            getPageNumber={(e) => {
              setPageNumber(e);
            }}
            getTotalPage={(e) => {
              setTotalPage(e);
            }}
            getProductsSorted={(e) => {
              setproductsSorted(e);
            }}
          />
        </div>

        <ModalAccount
          isVisible={AccountVisible}
          credentialsData={credentialsData}
          closeModal={() => {
            closeAccountHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeAccountHandler();
          }}
        />

        <ModalProductAdd
          isVisible={productAddVisible}
          branchesData={branchesData}
          closeModal={() => {
            closeproductHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeproductHandler();
          }}
        />

        <ModalProductEdit
          isVisible={productEditVisible}
          productData={productData}
          closeModal={() => {
            closeproductEditHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeproductEditHandler();
          }}
        />

        <ModalProductDelete
          isVisible={productDeleteVisible}
          productData={productData}
          closeModal={() => {
            closeproductDeleteHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeproductDeleteHandler();
          }}
        />
      </div>
    </div>
  );
}
