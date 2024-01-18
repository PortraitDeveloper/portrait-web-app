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
import AddFilters from "../../_Components/AddFilters";
import TotalOrders from "../../_Components/TotalOrders/page";
import FilterBranch from "../../_Components/FilterBranch";
import FilterBook from "../../_Components/FilterBook";
import FilterPayment from "../../_Components/FilterPayment";
import DataTransaction from "../../_Components/DataTransaction";
import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";
import ModalOrderDetail from "../../_Components/ModalOrderDetail";
import ModalChangeOrder from "../../_Components/ModalChangeOrder";
import ModalCustomerDetail from "../../_Components/ModalCustomerDetail";
import ModalFilter from "../../_Components/ModalFilter";
import ModalLoading from "../../_Components/ModalLoading";
import ModalRefund from "../../_Components/ModalRefund";
import dataConversion from "@/utils/dataConversion";
import getProductType from "@/utils/getProductType";
const pageTitle = "Transaction";

export default function TransactionPage() {
  const [credentialsData, setCredentialsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [addonsData, setAddonsData] = useState([]);

  const [ordersData, setOrdersData] = useState([]);
  const [ordersDataSorted, setOrdersDataSorted] = useState({});
  const [orderSelected, setOrderSelected] = useState({});
  const [orderDetailSelected, setOrderDetailSelected] = useState({});

  const [totalTransaction, setTotalTransaction] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);

  const [keyword, setKeyword] = useState("null");
  const [branchId, setBranchId] = useState("all");
  const [book, setBook] = useState("all");
  const [payment, setPayment] = useState("all");

  const [perPage, setPerPage] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");

  const [AccountVisible, setAccountVisible] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [changeOrderVisible, setChangeOrderVisible] = useState(false);
  const [customerDetailVisible, setCustomerDetailVisible] = useState(false);
  const [refundOrderVisible, setRefundOrderVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // Displays data in real time
  const [productId, setProductId] = useState(null);
  const [productBid, setProductBid] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productType, setProductType] = useState(null);
  const [productPrice, setProductPrice] = useState(null);

  const [numberPerson, setNumberPerson] = useState(null);
  const [personPrice, setPersonPrice] = useState(null);

  const [numberPet, setNumberPet] = useState(null);
  const [petPrice, setPetPrice] = useState(null);

  const [numberPrint5r, setNumberPrint5r] = useState(null);
  const [print5rPrice, setPrint5rPrice] = useState(null);

  const [numberSoftfile, setNumberSoftfile] = useState(null);
  const [softfilePrice, setSoftfilePrice] = useState(null);

  const [subTotal, setSubTotal] = useState(null);
  const [voucherCode, setVoucherCode] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [total, setTotal] = useState(null);
  const [prevTotal, setPrevTotal] = useState(null);
  const [priceDiff, setPriceDiff] = useState(null);

  useEffect(() => {
    getCredentialsData();
    getBranchesData();
    getAddonsData();
    getProductsData();
  }, []);

  useEffect(() => {
    getOrdersData();
  }, [
    branchId,
    keyword,
    book,
    payment,
    changeOrderVisible,
    refundOrderVisible,
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

  const getAddonsData = async () => {
    let response = await fetch(`/api/data/additional/null`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setAddonsData(response.data);
  };

  const getProductsData = async () => {
    let response = await fetch("/api/data/product/null/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();
    setProductsData(response.data);
  };

  const getOrdersData = async () => {
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
      const _ordersData = response.data;
      setOrdersData(_ordersData);

      const _totalTransactions = _ordersData.length;
      setTotalTransaction(_totalTransactions);

      const _totalPage = Math.ceil(_totalTransactions / perPage);
      setTotalPage(_totalPage);

      let _transactions = [];
      for (let i = 0; i < _totalTransactions; i++) {
        _transactions.push(_ordersData[i].transactions);
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

  const closeOrderDetailHandler = () => {
    setOrderDetailVisible(false);
  };

  const closeChangeOrderHandler = () => {
    setChangeOrderVisible(false);
  };

  const closeCustomerDetailHandler = () => {
    setCustomerDetailVisible(false);
  };

  const closeRefundHandler = () => {
    setRefundOrderVisible(false);
  };

  const closeFilterHandler = () => {
    setFilterVisible(false);
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
            placeholder="Find by Customer"
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

              <FilterBranch
                branchesData={branchesData}
                getBranchId={(e) => {
                  setBranchId(e);
                }}
              />

              <FilterBook
                getBookStatus={(e) => {
                  setBook(e);
                }}
              />

              <FilterPayment
                getPaymentStatus={(e) => {
                  setPayment(e);
                }}
              />
            </div>
          </div>
        </div>

        <div className="block sm:hidden mb-3">
          <div className="flex justify-between items-center">
            <AddFilters
              openModal={() => {
                setFilterVisible(true);
              }}
            />
            <AddTransaction />
          </div>
        </div>

        {/* HIDE MESSAGE AT BREAKPOINT-LG: @media (min-width: 1024px) */}
        <div className="block lg:hidden h-10 mb-2">
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

        <div className="flex flex-col justify-between border border-black rounded-3xl overflow-auto pb-4 h-1/2 md:h-2/3 lg:2/3 xl:h-3/5">
          <DataTransaction
            ordersData={ordersDataSorted}
            loading={loading}
            dataAvailable={dataAvailable}
            getOrderDetail={(e) => {
              const dataConv = dataConversion(e);
              setOrderSelected(e);
              setOrderDetailSelected(dataConv);
              setOrderDetailVisible(true);
            }}
            getChangeOrder={(e) => {
              const productName = e.products.product_name;
              const productType = getProductType(productName);
              const _numberSoftfile = e.is_add_softfile ? 1 : 0;

              setProductId(e.products.product_id);
              setProductBid(e.products.branch_id);
              setProductName(productName);
              setProductType(productType);
              setProductPrice(e.products.product_price);
              console.log("InitialProductPrice:", e.products.product_price);

              setNumberPerson(e.number_of_add_person);
              setPersonPrice(e.transactions.additional_person_price);
              console.log(
                "InitialPersonPrice:",
                e.transactions.additional_person_price
              );

              setNumberPet(e.number_of_add_pet);
              setPetPrice(e.transactions.additional_pet_price);
              console.log(
                "InitialPetPrice:",
                e.transactions.additional_pet_price
              );

              setNumberPrint5r(e.number_of_add_print5r);
              setPrint5rPrice(e.transactions.additional_print5r_price);
              console.log(
                "InitialPrint5rPrice:",
                e.transactions.additional_print5r_price
              );

              setNumberSoftfile(_numberSoftfile);
              setSoftfilePrice(e.transactions.additional_softfile_price);
              console.log(
                "InitialSoftfilePrice:",
                e.transactions.additional_softfile_price
              );

              setChangeOrderVisible(true);
            }}
            getCustomerDetail={(e) => {
              setOrderSelected(e);
              setCustomerDetailVisible(true);
            }}
            getRefund={(e) => {
              setOrderSelected(e);
              setRefundOrderVisible(true);
            }}
          />

          <PagePagination
            loading={loading}
            dataAvailable={dataAvailable}
            perPage={perPage}
            pageNumber={pageNumber}
            totalPage={totalPage}
            data={ordersData}
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
              setOrdersDataSorted(e);
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

        <ModalOrderDetail
          orderData={orderSelected}
          orderDetailData={orderDetailSelected}
          isVisible={orderDetailVisible}
          closeModal={() => {
            closeOrderDetailHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeOrderDetailHandler();
          }}
        />

        <ModalChangeOrder
          isVisible={changeOrderVisible}
          productsData={productsData}
          addonsData={addonsData}
          productId={productId}
          productBid={productBid}
          productName={productName}
          productType={productType}
          productPrice={productPrice}
          numberPerson={numberPerson}
          personPrice={personPrice}
          numberPet={numberPet}
          petPrice={petPrice}
          numberPrint5r={numberPrint5r}
          print5rPrice={print5rPrice}
          numberSoftfile={numberSoftfile}
          softfilePrice={softfilePrice}
          getProductId={(e) => {
            setProductId(e);
          }}
          getProductBid={(e) => {
            setProductBid(e);
          }}
          getProductName={(e) => {
            setProductName(e);
          }}
          getProductType={(e) => {
            setProductType(e);
          }}
          getProductPrice={(e) => {
            console.log("ProductPrice:", e);
            setProductPrice(e);
          }}
          getNumberPerson={(e) => {
            setNumberPerson(e);
          }}
          getPersonPrice={(e) => {
            console.log("PersonPrice:", e);
            setPersonPrice(e);
          }}
          getNumberPet={(e) => {
            setNumberPet(e);
          }}
          getPetPrice={(e) => {
            console.log("PetPrice:", e);
            setPetPrice(e);
          }}
          getNumberPrint5r={(e) => {
            setNumberPrint5r(e);
          }}
          getPrint5rPrice={(e) => {
            console.log("Print5rPrice:", e);
            setPrint5rPrice(e);
          }}
          getNumberSoftfile={(e) => {
            setNumberSoftfile(e);
          }}
          getSoftfilePrice={(e) => {
            console.log("SoftfilePrice:", e);
            setSoftfilePrice(e);
          }}
          closeModal={() => {
            closeChangeOrderHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeChangeOrderHandler();
          }}
        />

        <ModalCustomerDetail
          orderData={orderSelected}
          isVisible={customerDetailVisible}
          closeModal={() => {
            closeCustomerDetailHandler();
          }}
        />

        <ModalRefund
          orderData={orderSelected}
          isVisible={refundOrderVisible}
          closeModal={() => {
            closeRefundHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeRefundHandler();
          }}
        />

        <ModalFilter
          orderData={orderSelected}
          isVisible={filterVisible}
          closeModal={() => {
            closeFilterHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeFilterHandler();
          }}
        />
      </div>
    </div>
  );
}
