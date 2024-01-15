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
import FilterDiscountType from "../../_Components/FilterDiscountType";
import AddButton from "../../_Components/AddButton";
import DataVoucher from "../../_Components/DataVoucher";
import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";
import ModalVoucherAdd from "../../_Components/ModalVoucherAdd";
import ModalVoucherEdit from "../../_Components/ModalVoucherEdit";
import ModalVoucherDelete from "../../_Components/ModalVoucherDelete";
import ModalLoading from "../../_Components/ModalLoading";
const pageTitle = "Voucher";

export default function VoucherPage() {
  const [credentialsData, setCredentialsData] = useState([]);

  const [vouchersData, setVouchersData] = useState([]);
  const [vouchersSorted, setVouchersSorted] = useState({});
  const [voucherData, setVoucherData] = useState({});

  const [keyword, setKeyword] = useState("null");

  const [perPage, setPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");

  const [AccountVisible, setAccountVisible] = useState(false);
  const [voucherAddVisible, setVoucherAddVisible] = useState(false);
  const [voucherEditVisible, setVoucherEditVisible] = useState(false);
  const [voucherDeleteVisible, setVoucherDeleteVisible] = useState(false);

  const [type, setType] = useState("percentage");

  useEffect(() => {
    getCredentialsData();
  }, []);

  useEffect(() => {
    getVouchersData();
  }, [
    keyword,
    type,
    voucherAddVisible,
    voucherEditVisible,
    voucherDeleteVisible,
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

  const getVouchersData = async () => {
    let response = await fetch(`/api/data/voucher/${keyword}/${type}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();

    if (response.status === 404) {
      setDataAvailable(false);
      setLoading(true);
      setColor("red");
      setMessage("Data tidak ditemukan");
    } else {
      const _totalPage = Math.ceil(response.data.length / perPage);
      setTotalPage(_totalPage);
      setVouchersData(response.data);
      setDataAvailable(true);
      setLoading(true);
    }
  };

  const closeAccountHandler = () => {
    setAccountVisible(false);
  };

  const closeVoucherHandler = () => {
    setVoucherAddVisible(false);
  };

  const closeVoucherEditHandler = () => {
    setVoucherEditVisible(false);
  };

  const closeVoucherDeleteHandler = () => {
    setVoucherDeleteVisible(false);
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

        <div className="flex justify-center items-center gap-3 mb-3 lg:mb-4">
          {/* SHOW UP OPTION-NAVBAR / DROPDOWN AT BREAKPOINT-MD: @media (min-width: 768px) */}
          <div className="block md:hidden">
            <OptionNavbar
              credentialsData={credentialsData}
              openModal={() => setAccountVisible(true)}
            />
          </div>

          <Searchbar
            placeholder="Find by Voucher Code"
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
        <div className="block sm:hidden mb-3 lg:mb-4">
          <div className="flex justify-between items-center">
            <FilterDiscountType
              getDiscountType={(e) => {
                setType(e);
              }}
            />

            <AddButton
              title={pageTitle}
              openModal={() => setVoucherAddVisible(true)}
            />
          </div>
        </div>

        {/* HIDE PAGE-TITLE, FILTER-BRANCH, AND ADD-BUTTON AT BREAKPOINT-SM: @media (min-width: 640px) */}
        <div className="hidden sm:block mb-4">
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

            <div className="flex justify-center items-center">
              <FilterDiscountType
                getDiscountType={(e) => {
                  setType(e);
                }}
              />
              <AddButton
                title={pageTitle}
                openModal={() => setVoucherAddVisible(true)}
              />
            </div>
          </div>
        </div>

        {/* SHOW UP MESSAGE AT BREAKPOINT-LG: @media (min-width: 1024px) */}
        <div className="block lg:hidden h-10 mb-1 md:mb-4 lg:mb-6">
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
          <DataVoucher
            title={pageTitle}
            vouchersData={vouchersSorted}
            discountType={type}
            loading={loading}
            dataAvailable={dataAvailable}
            getEdit={(e) => {
              setVoucherData(e);
              setVoucherEditVisible(true);
            }}
            getDelete={(e) => {
              setVoucherData(e);
              setVoucherDeleteVisible(true);
            }}
          />

          <PagePagination
            loading={loading}
            dataAvailable={dataAvailable}
            perPage={perPage}
            pageNumber={pageNumber}
            totalPage={totalPage}
            data={vouchersData}
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
              setVouchersSorted(e);
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

        <ModalVoucherAdd
          isVisible={voucherAddVisible}
          closeModal={() => {
            closeVoucherHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeVoucherHandler();
          }}
        />

        <ModalVoucherEdit
          isVisible={voucherEditVisible}
          type={type}
          voucherData={voucherData}
          closeModal={() => {
            closeVoucherEditHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeVoucherEditHandler();
          }}
        />

        <ModalVoucherDelete
          isVisible={voucherDeleteVisible}
          voucherData={voucherData}
          closeModal={() => {
            closeVoucherDeleteHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeVoucherDeleteHandler();
          }}
        />
      </div>
    </div>
  );
}
