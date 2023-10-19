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

interface TransactionData {
  recipient: string;
  amount: string;
  token: string;
  chain: string;
  tokenAddress: string | undefined;
  decimals: number | undefined;
  securityLevel: string;
  isNativeTx: boolean;
}

const Page: React.FC = () => {
  let [pageNumber, setPageNumber] = React.useState<number>(0);
  const [transactionData, setTransactionData] = React.useState<
    TransactionData | undefined
  >();

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
          onContinue={() => setPageNumber(1)}
          setTransactionData={setTransactionData}
        />
      ) : (
        <TestTransaction
          goBack={() => setPageNumber(0)}
          transactionData={transactionData}
        />
      )}
    </>
  );
};

export default Page;
