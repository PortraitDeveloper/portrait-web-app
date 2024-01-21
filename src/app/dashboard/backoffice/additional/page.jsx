/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SidebarContent from "../../_Components/SidebarContent";
import OptionNavbar from "../../_Components/OptionNavbar";
import Searchbar from "../../_Components/SearchBar";
import OptionAccount from "../../_Components/OptionAccount";
import PageTitle from "../../_Components/PageTitle";
import Message from "../../_Components/Message";
import DataAdditional from "../../_Components/DataAdditional";
import PagePagination from "../../_Components/PagePagination";
import ModalAccount from "../../_Components/ModalAccount";
import ModalAdditionalEdit from "../../_Components/ModalAdditionalEdit";
import ModalLoading from "../../_Components/ModalLoading";
const pageTitle = "Add-ons";

export default function AdditionalPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Add-ons Data
  const [additionalsData, setAdditionalsData] = useState([]);
  const [additionalsSorted, setAdditionalsSorted] = useState({});
  const [additionalData, setAdditionalData] = useState({});

  // Reference Data
  const [credentialsData, setCredentialsData] = useState([]);

  // Filter
  const [keyword, setKeyword] = useState("null");

  // Pagination
  const [perPage, setPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // Visibility
  const [AccountVisible, setAccountVisible] = useState(false);
  const [additionalEditVisible, setAdditionalEditVisible] = useState(false);

  // Others
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [message, setMessage] = useState(null);
  const [color, setColor] = useState("");
  const [role, setRole] = useState(null);

  const checkRole = () => {
    const _role = session?.user.role;
    setRole(_role);
    if (_role !== "backoffice") {
      router.push("/dashboard/operator/transaction");
    }
  };

  useEffect(() => {
    checkRole();
    getAdditionalsData();
  }, [keyword, additionalEditVisible, session]);

  useEffect(() => {
    getCredentialsData();
  }, []);

  const getAdditionalsData = async () => {
    let response = await fetch(`/api/data/additional/${keyword}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    response = await response.json();

    if (response.status === 404) {
      setDataAvailable(false);
      setColor("red");
      setMessage("Data tidak ditemukan");
    } else {
      const _totalPage = Math.ceil(response.data.length / perPage);
      setTotalPage(_totalPage);
      setAdditionalsData(response.data);
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

  const closeAccountHandler = () => {
    setAccountVisible(false);
  };

  const closeAdditionalEditHandler = () => {
    setAdditionalEditVisible(false);
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
          <SidebarContent role={role} pageTitle={pageTitle} />
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
            <OptionNavbar />
          </div>

          <Searchbar
            placeholder="Find by Item Name"
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

        {/* HIDE PAGE-TITLE, FILTER-BRANCH, AND ADD-BUTTON AT BREAKPOINT-SM: @media (min-width: 640px) */}
        <div className="hidden sm:block mb-3 sm:mb-4">
          <div className="flex justify-start items-center gap-6">
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
          <DataAdditional
            title={pageTitle}
            additionalsData={additionalsSorted}
            loading={loading}
            dataAvailable={dataAvailable}
            getEdit={(additionalData) => {
              setAdditionalData(additionalData);
              setAdditionalEditVisible(true);
            }}
          />

          <PagePagination
            loading={loading}
            dataAvailable={dataAvailable}
            perPage={perPage}
            pageNumber={pageNumber}
            totalPage={totalPage}
            data={additionalsData}
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
              setAdditionalsSorted(e);
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

        <ModalAdditionalEdit
          isVisible={additionalEditVisible}
          additionalData={additionalData}
          closeModal={() => {
            closeAdditionalEditHandler();
          }}
          finishModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeAdditionalEditHandler();
          }}
        />
      </div>
    </div>
  );
}
