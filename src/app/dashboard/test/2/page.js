"use client";
import { useStatem, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SidebarContent from "./components/SidebarContent";
import Searchbar from "./components/Searchbar";
import AccountOption from "./components/AccountOption";
import ProductData from "./components/ProductData";

export default function BackofficePage() {
  return (
    <div className="flex justify-center items-center">
      <div className="shadow-xl shadow-gray-400 h-screen">
        <div className="p-6">
          <SidebarContent />
        </div>
      </div>

      <div className="w-full h-screen px-6 pt-4">
        <div className="flex justify-center items-center mb-6">
          <Searchbar placeholder="Find Product by Name" />
          <AccountOption />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            {/* TITLE PAGE */}
            <h1 className="text-xl font-sora font-semibold">Product</h1>

            <div>
              {/* FILTER */}
              <select
                name="filter"
                id="filter"
                className="px-3 py-2.5 rounded-xl border border-black text-sm font-sora w-52 mr-3"
                required
                // onChange={changeHandler}
              >
                <option>Filter by Branch</option>
                <option value=""></option>
              </select>

              {/* ADD BUTTON */}
              <button className="px-3 py-2.5 bg-blue-900 hover:bg-blue-600 rounded-xl text-white text-sm font-sora ">
                Add Product +
              </button>
            </div>
          </div>
        </div>

        <div className="border border-black rounded-3xl flex justify-center overflow-auto p-4 h-114">
          <ProductData branchid={'br-3'} search={'Black'}/>
        </div>
      </div>
    </div>
  );
}
