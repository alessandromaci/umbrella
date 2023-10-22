"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import * as Separator from "@radix-ui/react-separator";

const SideMenu: React.FC<{
  onStart: () => void;
  onTransactions: () => void;
}> = ({ onStart, onTransactions }) => {
  return (
    <div className="text-white p-4 font-noto h-full justify-start self-center border-r-2 border-gray-400 text-sm flex flex-col ">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold font-outfit mt-0 mb-8">umbrella</h1>
        <br />
        <ConnectButton chainStatus='none'/>
        <button
          type="button"
          onClick={onStart}
          className="text-lg mt-2 font-semibold rounded-xl p-2 text-gray-00 w-[200px] hover:bg-sky-500 bg-sky-600 mb-14"
        >
          {"New Transaction"}
        </button>
        <br />
        <br />
      </div>
      <div className="flex-col justify-center" id="navigationLinks">
        <div className="flex justify-between items-center">
          <a className="font-semibold hover:underline text-lg" href="">
            About Umbrella
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <button className="font-semibold hover:underline text-lg">
            {"Notifications"}
          </button>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <a className="font-semibold hover:underline text-lg" href="">
            Address Book
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <a className="font-semibold hover:underline text-lg" href="">
            Escrow Contracts
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="font-semibold hover:underline text-lg"
            onClick={onTransactions}
          >
            {"Transactions"}
          </button>{" "}
          <i className="right-arrow"></i>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
