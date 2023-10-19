"use client";

import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
//import UserProfileForm from "./components/UserProfile";
import StartPage from "./components/StartPage";
import TestTransaction from "./components/TestTransaction";

// to use for tableland
// interface UserProfile {
//   userName: string;
//   country: string;
// }

const Page: React.FC = () => {
  let [pageNumber, setPageNumber] = React.useState<number>(0);
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
      {pageNumber === 0 ? (
        <StartPage
          onContinue={() => {
            setPageNumber(1);
          }}
        />
      ) : (
        <TestTransaction
          goBack={() => {
            setPageNumber(0);
          }}
        />
      )}
    </>
  );
};

export default Page;
