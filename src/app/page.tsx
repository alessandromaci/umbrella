"use client";

import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
//import UserProfileForm from "./components/UserProfile";
import TransactionDetail from "./components/TransactionDetail";

// to use for tableland
// interface UserProfile {
//   userName: string;
//   country: string;
// }

const Page: React.FC = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      <TransactionDetail />
    </>
  );
};

export default Page;
