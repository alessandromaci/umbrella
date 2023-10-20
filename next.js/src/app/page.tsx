"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import StartPage from "./components/StartPage";
import TestTransaction from "./components/TestTransaction";
import ConfirmReceipt from "./components/ConfirmReceipt";
import AddressBook from "./components/AddressBook";
import SideMenu from "./components/SideMenu";
import Notifications from "./components/Notifications";

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
  const [etherscanLink, setEtherscanLink] = React.useState<string>("");

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 5,
        }}
      >
        <ConnectButton chainStatus="icon" />
      </div>
      <div style={{ display: "flex" }}>
        <SideMenu onTransactions={() => setPageNumber(11)} />

        {pageNumber === 0 ? (
          <StartPage
            onContinue={() => setPageNumber(1)}
            setTransactionData={setTransactionData}
          />
        ) : pageNumber === 1 ? (
          <TestTransaction
            goBack={() => setPageNumber(0)}
            onContinue={() => setPageNumber(2)}
            transactionData={transactionData}
            setEtherscanLink={setEtherscanLink}
          />
        ) : pageNumber === 2 ? (
          <ConfirmReceipt
            goBack={() => setPageNumber(1)}
            onContinue={() => setPageNumber(3)}
            transactionData={transactionData}
            etherscanLink={etherscanLink}
          />
        ) : pageNumber === 3 ? (
          <AddressBook
            goBack={() => setPageNumber(2)}
            // onContinue={() => setPageNumber(4)}
            transactionData={transactionData}
          />
        ) : pageNumber === 11 ? (
          <Notifications goBack={() => setPageNumber(0)} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Page;
