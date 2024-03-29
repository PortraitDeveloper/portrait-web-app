/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import moment from "moment";
import "moment-timezone";
import SidebarContent from "../../_Components/SidebarContent";
import OptionNavbar from "../../_Components/OptionNavbar";
import Searchbar from "../../_Components/SearchBar";
import OptionAccount from "../../_Components/OptionAccount";
import PageTitle from "../../_Components/PageTitle";
import Message from "../../_Components/Message";
import AddTransaction from "../../_Components/AddTransaction";
import TotalOrders from "../../_Components/TotalOrders/page";
import FilterDateRange from "../../_Components/FilterDateRange";
import FilterBranch from "../../_Components/FilterBranch";
import FilterBook from "../../_Components/FilterBook";
import FilterPayment from "../../_Components/FilterPayment";
import DataTransaction from "../../_Components/DataTransaction";
import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";
import ModalDownload from "../../_Components/ModalDownload";
import ModalOrderDetail from "../../_Components/ModalOrderDetail";
import ModalChangeOrder from "../../_Components/ModalChangeOrder";
import ModalCustomerDetail from "../../_Components/ModalCustomerDetail";
import ModalLoading from "../../_Components/ModalLoading";
import ModalRefund from "../../_Components/ModalRefund";
import dataConversion from "@/utils/dataConversion";
import getProductType from "@/utils/getProductType";
const pageTitle = "Transaction";

export default function TransactionPage() {
  const router = useRouter();

  // Session
  const { data: session } = useSession();
  const role = session?.user.role;
  const accessToken = session?.user.accessToken;

  // Displays data in real time
  const [bookId, setBookId] = useState(null);
  const [bookCode, setBookCode] = useState(null);
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

  // Order Data
  const [ordersData, setOrdersData] = useState([]);
  const [ordersDataSorted, setOrdersDataSorted] = useState({});
  const [orderSelected, setOrderSelected] = useState({});
  const [orderDetailSelected, setOrderDetailSelected] = useState({});

  // References Data
  const [addonsData, setAddonsData] = useState([]);
  const [branchesData, setBranchesData] = useState([]);
  const [credentialsData, setCredentialsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [vouchersData, setVouchersData] = useState([]);

  // Total Transactions Data
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);

  // Filter
  const [keyword, setKeyword] = useState("null");
  const [branchId, setBranchId] = useState("all");
  const [book, setBook] = useState("all");
  const [payment, setPayment] = useState("all");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Pagination
  const [perPage, setPerPage] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // Visibility
  const [accountVisible, setModalAccountVisible] = useState(false);
  const [downloadVisible, setModalDownloadVisible] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [changeOrderVisible, setChangeOrderVisible] = useState(false);
  const [customerDetailVisible, setCustomerDetailVisible] = useState(false);
  const [refundOrderVisible, setRefundOrderVisible] = useState(false);

  // Others
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");

  const checkSession = () => {
    if (accessToken && role !== "backoffice") {
      router.push("/dashboard/operator/transaction");
    }
  };

  useEffect(() => {
    checkSession();
    getOrdersData();
  }, [
    keyword,
    branchId,
    book,
    payment,
    dateRange,
    changeOrderVisible,
    refundOrderVisible,
    session,
  ]);

  useEffect(() => {
    checkSession();
    getAddonsData();
  }, []);

  useEffect(() => {
    checkSession();
    getBranchesData();
  }, []);

  useEffect(() => {
    checkSession();
    getCredentialsData();
  }, []);

  useEffect(() => {
    checkSession();
    getProductsData();
  }, []);

  useEffect(() => {
    checkSession();
    getVouchersData();
  }, []);

  const getOrdersData = async () => {
    const start = moment(dateRange[0].startDate)
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DD");
    const end = moment(dateRange[0].endDate)
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DD");

    let response = await fetch(
      `/api/data/book/${keyword}/${branchId}/${book}/${payment}/${start}/${end}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: accessToken,
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
        (item) =>
          item.payment_status === "refund" ||
          item.payment_status === "partial_refund"
      );
      setTotalRefund(_totalRefund.length);
      setDataAvailable(true);
      setLoading(true);
    }
  };

  const getAddonsData = async () => {
    let response = await fetch(`/api/data/additional/null`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    response = await response.json();
    setAddonsData(response.data);
  };

  const getBranchesData = async () => {
    let response = await fetch(`/api/data/branch`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    response = await response.json();
    setBranchesData(response.data);
  };

  const getCredentialsData = async () => {
    let response = await fetch("/api/data/credential", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    response = await response.json();
    setCredentialsData(response.data);
  };

  const getProductsData = async () => {
    let response = await fetch("/api/data/product/null/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    response = await response.json();
    setProductsData(response.data);
  };

  const getVouchersData = async () => {
    let response = await fetch("/api/data/voucher/null/null", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });

    response = await response.json();
    setVouchersData(response.data);
  };

  const closeAccountHandler = () => {
    setModalAccountVisible(false);
  };

  const closeDownloadHandler = () => {
    setModalDownloadVisible(false);
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
          <SidebarContent pageTitle={pageTitle} role={role} />
        </div>
      </div>

      <div className="w-full p-3 md:p-3 lg:p-6">
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
            role={role}
            page={pageTitle}
            openModalAccount={() => setModalAccountVisible(true)}
            openModalDownload={() => setModalDownloadVisible(true)}
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

        <div className="block sm:hidden mb-3">
          <div className="flex justify-between">
            <PageTitle pageTitle={pageTitle} />
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
              <FilterDateRange
                getDateRanges={(ranges) => {
                  setDateRange([ranges.selection]);
                }}
              />

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
          <div className="grid grid-cols-2 gap-3">
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

            <FilterDateRange
              getDateRanges={(ranges) => {
                setDateRange([ranges.selection]);
              }}
            />

            <FilterBranch
              branchesData={branchesData}
              getBranchId={(e) => {
                setBranchId(e);
              }}
            />
          </div>
        </div>

        {/* HIDE MESSAGE AT BREAKPOINT-LG: @media (min-width: 1024px) */}
        <div className="block lg:hidden h-10 sm:mb-2">
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
            role={role}
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

              setBookId(e.book_id);
              setBookCode(e.book_code);
              setProductId(e.products.product_id);
              setProductBid(e.products.branch_id);
              setProductName(productName);
              setProductType(productType);
              setProductPrice(e.products.product_price);
              setNumberPerson(e.number_of_add_person);
              setPersonPrice(e.transactions.additional_person_price);
              setNumberPet(e.number_of_add_pet);
              setPetPrice(e.transactions.additional_pet_price);
              setNumberPrint5r(e.number_of_add_print5r);
              setPrint5rPrice(e.transactions.additional_print5r_price);
              setNumberSoftfile(_numberSoftfile);
              setSoftfilePrice(e.transactions.additional_softfile_price);
              setSubTotal(e.transactions.total_price);
              setVoucherCode(e.transactions.voucher_code);
              setDiscount(
                e.transactions.total_price - e.transactions.total_paid_by_cust
              );
              setTotal(e.transactions.total_paid_by_cust);
              setPrevTotal(e.transactions.total_paid_by_cust);
              setPriceDiff(e.transactions.price_diff);

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
          accessToken={accessToken}
          isVisible={accountVisible}
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

        <ModalDownload
          accessToken={accessToken}
          isVisible={downloadVisible}
          closeModal={() => {
            closeDownloadHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeDownloadHandler();
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
          accessToken={accessToken}
          isVisible={changeOrderVisible}
          productsData={productsData}
          addonsData={addonsData}
          vouchersData={vouchersData}
          bookId={bookId}
          bookCode={bookCode}
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
          subTotal={subTotal}
          voucherCode={voucherCode}
          discount={discount}
          total={total}
          prevTotal={prevTotal}
          priceDiff={priceDiff}
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
            setProductPrice(e);
          }}
          getNumberPerson={(e) => {
            setNumberPerson(e);
          }}
          getPersonPrice={(e) => {
            setPersonPrice(e);
          }}
          getNumberPet={(e) => {
            setNumberPet(e);
          }}
          getPetPrice={(e) => {
            setPetPrice(e);
          }}
          getNumberPrint5r={(e) => {
            setNumberPrint5r(e);
          }}
          getPrint5rPrice={(e) => {
            setPrint5rPrice(e);
          }}
          getNumberSoftfile={(e) => {
            setNumberSoftfile(e);
          }}
          getSoftfilePrice={(e) => {
            setSoftfilePrice(e);
          }}
          getSubTotal={(e) => {
            setSubTotal(e);
          }}
          getDiscount={(e) => {
            setDiscount(e);
          }}
          getTotal={(e) => {
            setTotal(e);
          }}
          getPriceDiff={(e) => {
            setPriceDiff(e);
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
          accessToken={accessToken}
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
      </div>
    </div>
  );
}
