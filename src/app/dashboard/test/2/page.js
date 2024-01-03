"use client";
import { useState, useEffect } from "react";
import SidebarContent from "./components/SidebarContent";
import Searchbar from "./components/Searchbar";
import AccountOption from "./components/AccountOption";
import PageTitle from "./components/PageTitle";
import Filter from "./components/Filter";
import AddButton from "./components/AddButton";
import DataProduct from "./components/DataProduct";

export default function BackofficePage() {
  const pageTitle = "Product";
  const [branchId, setBranchId] = useState("all");
  const [keyword, setKeyword] = useState("null");
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  const showAccountModalHandler = () => {
    setAccountModalVisible(true);
  };

  const hideAccountModalHandler = () => {
    setAccountModalVisible(false);
  };

  const showProductModalHandler = () => {
    setAccountModalVisible(true);
  };

  const hideProductModalHandler = () => {
    setAccountModalVisible(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="shadow-xl shadow-gray-400 h-screen">
        <div className="p-6">
          <SidebarContent />
        </div>
      </div>

      <div className="w-full h-screen px-6 pt-4">
        <div className="flex justify-center items-center mb-6">
          <Searchbar
            placeholder="Find Product by Name"
            getKeyword={(e) => {
              setKeyword(e);
            }}
          />
          <AccountOption />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <PageTitle title="Product" />

            <div>
              <Filter
                getBranchId={(e) => {
                  setBranchId(e);
                }}
              />

              <AddButton
                title={pageTitle}
                getClickHandler={showProductModalHandler}
              />
            </div>
          </div>
        </div>

        <div className="border border-black rounded-3xl flex justify-center overflow-auto p-4 h-114">
          <DataProduct branchid={branchId} keyword={keyword} />
        </div>
      </div>
    </div>
  );
}
