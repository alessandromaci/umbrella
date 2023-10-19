"use client";

import React from "react";
import * as Separator from "@radix-ui/react-separator";

export default function Home() {
  return (
    <div className="max-w-fit min-w-fit p-4 w-[17%] font-noto h-screen justify-start self-center border-r-2 border-gray-400 text-sm flex flex-col ">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold font-outfit mt-0 mb-4">umbrella</h1>
        <br />
        <button className="text-lg font-semibold rounded-lg p-2 text-gray-00 w-[200px] bg-sky-500 mb-2">
          Connect
        </button>
        <button className="text-lg font-semibold rounded-lg p-2 text-gray-00 w-[200px] bg-sky-500 mb-16">
          New Transaction
        </button>
        <br />
        <br />
      </div>
      <div className="flex-col justify-center" id="navigationLinks">
        <div className="flex justify-between items-center">
          <a className="font-semibold text-lg text-gray-950" href="">
            About Umbrella
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-blackA2 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <a className="font-semibold text-lg text-gray-950" href="">
            Notifications
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-blackA2 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <a className="font-semibold text-lg text-gray-950" href="">
            Address Book
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-blackA2 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <a className="font-semibold text-lg text-gray-950" href="">
            Escrow Contracts
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
        <Separator.Root className="bg-blackA2 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[13px]" />
        <div className="flex justify-between items-center">
          <a className="font-semibold text-lg text-gray-950" href="">
            Transactions
          </a>{" "}
          <i className="right-arrow"></i>
        </div>
      </div>
      <div className="absolute bottom-4 font-semibold text-xs tighter ">
        <p className="">
          Made with ❤️ by<a href=""> Alerex, Julo & Mihir</a>
        </p>
      </div>
    </div>
  );
}
