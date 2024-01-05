"use client";
import { useState, useEffect } from "react";
import SidebarContent from "./Components/SidebarContent";
import Searchbar from "./Components/SearchBar";
import AccountOption from "./Components/AccountOption";
import PageTitle from "./Components/PageTitle";
import Filter from "./Components/FilterBranch";
import AddButton from "./Components/AddButton";
import DataProduct from "./Components/DataProduct";
import ModalAccount from "./Components/ModalAccount";
import ModalProduct from "./Components/ModalProduct";
import Message from "./Components/Message";

export default function BackofficePage() {
  const pageTitle = "Product";
  const [branchId, setBranchId] = useState("all");
  const [keyword, setKeyword] = useState("null");
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const closeAccountModalHandler = () => {
    setAccountModalVisible(false);
  };

  const closeProductModalHandler = () => {
    setProductModalVisible(false);
  };

  const hideMessageHandler = () => {
    setMessage("");
    setColor("blue");
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
          <AccountOption openModal={() => setAccountModalVisible(true)} />
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
              <Filter
                getBranchId={(e) => {
                  setBranchId(e);
                }}
              />

              <AddButton
                title={pageTitle}
                openModal={() => setProductModalVisible(true)}
              />
            </div>
          </div>
        </div>

        <div className="border border-black rounded-3xl flex justify-center overflow-auto p-4 h-3/4">
          <DataProduct
            branchid={branchId}
            keyword={keyword}
            refresh={productModalVisible}
          />
        </div>

        <ModalAccount
          isVisible={accountModalVisible}
          closeModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeAccountModalHandler();
          }}
        />

        <ModalProduct
          isVisible={productModalVisible}
          closeModal={(message, color) => {
            setMessage(message);
            setColor(color);
            closeProductModalHandler();
          }}
        />
      </div>
    </div>
  );
}
