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
import AddTransaction from "../../_Components/AddTransaction";
import DataTransaction from "../../_Components/DataTransaction";
import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";
import ModalLoading from "../../_Components/ModalLoading";
import TotalOrders from "../../_Components/TotalOrders/page";
const pageTitle = "Transaction";

export default function TransactionPage() {
  const [credentialsData, setCredentialsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);

  const [orders, setOrders] = useState([]);
  const [ordersSorted, setOrdersSorted] = useState({});
  const [orderSelected, setOrderSelected] = useState({});

  const [totalTransaction, setTotalTransaction] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);

  const [branchId, setBranchId] = useState("all");
  const [keyword, setKeyword] = useState("null");

  const [perPage, setPerPage] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");

  const [AccountVisible, setAccountVisible] = useState(false);
  const [transactionAddVisible, setTransactionAddVisible] = useState(false);
  const [transactionEditVisible, setTransactionEditVisible] = useState(false);
  const [transactionDeleteVisible, setTransactionDeleteVisible] =
    useState(false);

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
    let response = await fetch(`/api/data/book`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setLoading(true);

    if (response.status === 404) {
      setDataAvailable(false);
      setLoading(true);
      setColor("red");
      setMessage("Data tidak ditemukan");
    } else {
      const _orders = response.data;
      setOrders(_orders);

      const _totalTransactions = _orders.length;
      setTotalTransaction(_totalTransactions);

      const _totalPage = Math.ceil(_totalTransactions / perPage);
      setTotalPage(_totalPage);

      let _transactions = [];
      for (let i = 0; i < _totalTransactions; i++) {
        _transactions.push(_orders[i].transactions);
      }

      let _totalPaid = _transactions.filter(
        (item) => item.payment_status === "paid"
      );
      setTotalPaid(_totalPaid.length);

      let _totalUnpaid = _transactions.filter(
        (item) => item.payment_status === "unpaid"
      );
      setTotalUnpaid(_totalUnpaid.length);

      let _totalRefund = _transactions.filter(
        (item) => item.payment_status === "refund"
      );
      setTotalRefund(_totalRefund.length);

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
      <div className="hidden md:block shadow-lg shadow-gray-400">
        <div className="p-6">
          <SidebarContent pageTitle={pageTitle} />
        </div>
      </div>

      <div className="w-full p-3 md:p-3 lg:p-6">
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

        <div className="flex justify-center items-center gap-3 mb-3">
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

        <div className="hidden sm:block ">
          <div className="flex justify-end md:justify-between items-center gap-3 mb-3">
            <div className="hidden md:block">
              <PageTitle pageTitle={pageTitle} />
            </div>
            <Message
              message={message}
              color={color}
              onHide={() => {
                setColor("");
                setMessage(null);
                hideMessageHandler();
              }}
            />
            <AddTransaction />
          </div>
        </div>

        <div className="flex justify-center lg:justify-start gap-3 mb-3">
          <TotalOrders
            totalTransaction={totalTransaction}
            totalPaid={totalPaid}
            totalUnpaid={totalUnpaid}
            totalRefund={totalRefund}
          />
        </div>

        <div className="hidden sm:block ">
          <div className="flex justify-center lg:justify-between items-center mb-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="border border-blue-900 rounded-2xl text-blue-900 text-sm text-center p-2 w-48">
                Periode
              </div>
              <div className="border border-blue-900 rounded-2xl text-blue-900 text-sm text-center p-2 w-48">
                Paskal
              </div>
              <div className="border border-blue-900 rounded-2xl text-blue-900 text-sm text-center p-2 w-48">
                All Book
              </div>
              <div className="border border-blue-900 rounded-2xl text-blue-900 text-sm text-center p-2 w-48">
                All Payment
              </div>
            </div>
          </div>
        </div>

        <div className="block sm:hidden mb-3">
          <div className="flex justify-between items-center">
            <div className="bg-blue-900 rounded-xl text-sm text-white px-3 py-2 w-38">
              Filter
            </div>
            <AddTransaction />
          </div>
        </div>

        {/* HIDE MESSAGE AT BREAKPOINT-LG: @media (min-width: 1024px) */}
        <div className="block lg:hidden">
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

        <div className="flex flex-col justify-between border border-black rounded-3xl overflow-auto pb-4 h-3/5 md:h-2/3 lg:2/3 xl:h-3/5">
          <DataTransaction
            title={pageTitle}
            transactionsData={ordersSorted}
            loading={loading}
            dataAvailable={dataAvailable}
            getEdit={(e) => {
              setOrderSelected(e);
              setTransactionEditVisible(true);
            }}
            getDelete={(e) => {
              setOrderSelected(e);
              setTransactionDeleteVisible(true);
            }}
          />

          <PagePagination
            loading={loading}
            dataAvailable={dataAvailable}
            perPage={perPage}
            pageNumber={pageNumber}
            totalPage={totalPage}
            data={orders}
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
              setOrdersSorted(e);
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
