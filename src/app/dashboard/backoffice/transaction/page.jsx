/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SidebarContent from "../../_Components/SidebarContent";
import OptionNavbar from "../../_Components/OptionNavbar";
import Searchbar from "../../_Components/SearchBar";
import OptionAccount from "../../_Components/OptionAccount";
import PageTitle from "../../_Components/PageTitle";
import Message from "../../_Components/Message";

import AddButton from "../../_Components/AddButton";

import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";

import ModalLoading from "../../_Components/ModalLoading";
const pageTitle = "Transaction";

export default function TransactionPage() {
  const [credentialsData, setCredentialsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);

  const [transactionsData, setTransactionsData] = useState([]);
  const [transactionsSorted, setTransactionsSorted] = useState({});
  const [transactionData, setTransactionData] = useState({});

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
  const [transactionAddVisible, setTransactionAddVisible] = useState(false);
  const [transactionEditVisible, setTransactionEditVisible] = useState(false);
  const [transactionDeleteVisible, setTransactionDeleteVisible] = useState(false);

  useEffect(() => {
    getCredentialsData();
  }, []);

  useEffect(() => {
    getBranchesData();
  }, []);

  useEffect(() => {
    getTransactionsData();
  }, [
    branchId,
    keyword,
    transactionAddVisible,
    transactionEditVisible,
    transactionDeleteVisible,
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

  const getTransactionsData = async () => {
    let response = await fetch(
      `/api/data/transaction/${keyword}/${branchId}`,
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
      setTransactionsData(response.data);
      setDataAvailable(true);
      setLoading(true);
    }
  };

  const closeAccountHandler = () => {
    setAccountVisible(false);
  };

  const closeTransactionHandler = () => {
    setTransactionAddVisible(false);
  };

  const closeTransactionEditHandler = () => {
    setTransactionEditVisible(false);
  };

  const closeTransactionDeleteHandler = () => {
    setTransactionDeleteVisible(false);
  };

  const hideMessageHandler = () => {
    setMessage(null);
    setColor("");
  };

  return (
    <div className="flex justify-center h-screen">
      {!loading && <ModalLoading />}

      {/* HIDE SIDEBAR AT BREAKPOINT-MD: @media (min-width: 768px) */}
      <div className="hidden md:block shadow-xl shadow-gray-400">
        <div className="p-6">
          <SidebarContent pageTitle={pageTitle} />
        </div>
      </div>

      <div className="w-full p-3 md:p-4 lg:p-6">
        {/* SHOW UP TPP-LOGO AND TITLE AT BREAKPOINT-SM: @media (min-width: 640px) */}
        <div className="block sm:hidden mb-2">
          <div className="flex justify-between items-center">
            <PageTitle pageTitle={pageTitle} />
            <Image
              src="/portraitPlace.png"
              alt="TPP Logo"
              width={90}
              height={90}
            />
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mb-3 md:mb-4 lg:mb-6">
          {/* SHOW UP OPTION-NAVBAR / DROPDOWN AT BREAKPOINT-MD: @media (min-width: 768px) */}
          <div className="block md:hidden">
            <OptionNavbar />
          </div>

          <Searchbar
            placeholder="Find transaction by Name"
            getKeyword={(e) => {
              setKeyword(e);
            }}
          />
          <OptionAccount
            credentialsData={credentialsData}
            openModal={() => setAccountVisible(true)}
          />
        </div>

        {/* SHOW UP FILTER-BRANCH AND ADD-BUTTON AT BREAKPOINT-SM: @media (min-width: 640px) */}
        <div className="block sm:hidden mb-3 md:mb-4 lg:mb-6">
          <div className="flex justify-between items-center">
            {/* FILTER */}

            <AddButton
              title={pageTitle}
              openModal={() => setTransactionAddVisible(true)}
            />
          </div>
        </div>

        {/* HIDE PAGE-TITLE, FILTER-BRANCH, AND ADD-BUTTON AT BREAKPOINT-SM: @media (min-width: 640px) */}
        <div className="hidden sm:block mb-6">
          <div className="flex justify-between items-center">
            <PageTitle pageTitle={pageTitle} />

            {/* HIDE MESSAGE AT BREAKPOINT-LG: @media (min-width: 1024px) */}
            <div className="hidden lg:block">
              <Message
                message={message}
                color={color}
                onHide={() => {
                  setColor("");
                  setMessage(null);
                  hideMessageHandler();
                }}
              />
            </div>

            <div>
              {/* FILTER */}

              <AddButton
                title={pageTitle}
                openModal={() => setTransactionAddVisible(true)}
              />
            </div>
          </div>
        </div>

        {/* SHOW UP MESSAGE AT BREAKPOINT-LG: @media (min-width: 1024px) */}
        <div className="block lg:hidden h-10 mb-3 md:mb-4 lg:mb-6">
          <Message
            message={message}
            color={color}
            onHide={() => {
              setColor("");
              setMessage(null);
              hideMessageHandler();
            }}
          />
        </div>

        <div className="flex flex-col justify-between border border-black rounded-3xl overflow-auto pb-4 h-2/3 md:h-4/5 lg:h-3/4">
          {/* <Datatransaction
            title={pageTitle}
            transactionsData={transactionsSorted}
            loading={loading}
            dataAvailable={dataAvailable}
            getEdit={(e) => {
              setTransactionData(e);
              setTransactionEditVisible(true);
            }}
            getDelete={(e) => {
              setTransactionData(e);
              setTransactionDeleteVisible(true);
            }}
          /> */}

          {/* <PagePagination
            loading={loading}
            dataAvailable={dataAvailable}
            perPage={perPage}
            pageNumber={pageNumber}
            totalPage={totalPage}
            data={transactionsData}
            getPerPage={(e) => {
              setPerPage(e);
            }}
            getPageNumber={(e) => {
              setPageNumber(e);
            }}
            getTotalPage={(e) => {
              setTotalPage(e);
            }}
            getDataSorted={(e) => {
              setTransactionsSorted(e);
            }}
          /> */}
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

        {/* <ModaltransactionAdd
          isVisible={transactionAddVisible}
          branchesData={branchesData}
          closeModal={() => {
            closeTransactionHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeTransactionHandler();
          }}
        />

        <ModaltransactionEdit
          isVisible={transactionEditVisible}
          transactionData={transactionData}
          closeModal={() => {
            closeTransactionEditHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeTransactionEditHandler();
          }}
        />

        <ModaltransactionDelete
          isVisible={transactionDeleteVisible}
          transactionData={transactionData}
          closeModal={() => {
            closeTransactionDeleteHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeTransactionDeleteHandler();
          }}
        /> */}
      </div>
    </div>
  );
}
