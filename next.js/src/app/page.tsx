"use client";

import React from "react";
import StartPage from "./components/StartPage";
import TestTransaction from "./components/TestTransaction";
import ConfirmReceipt from "./components/ConfirmReceipt";
import AddressBook from "./components/AddressBook";
import SideMenu from "./components/SideMenu";
import Notifications from "./components/Notifications";
import IntelligenceAnalysis from "./components/IntelligenceAnalysis";
import EscrowContract from "./components/EscrowContract";

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
    <div className="w-full flex">
      <div className="side-menu w-[23%]">
        <SideMenu
          onTransactions={() => setPageNumber(11)}
          onStart={() => setPageNumber(0)}
        />
      </div>
      <div className="place-content-center p-6 flex w-full  ">
        {pageNumber === 0 ? (
          <StartPage
            onContinue={() => setPageNumber(1)}
            onContract={() => setPageNumber(5)}
            setTransactionData={setTransactionData}
          />
        ) : pageNumber === 1 ? (
          <TestTransaction
            goBack={() => setPageNumber(0)}
            onContinue={() => setPageNumber(2)}
            onAnalysis={() => setPageNumber(4)}
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
            onContinue={() => setPageNumber(4)}
            transactionData={transactionData}
          />
        ) : pageNumber === 4 ? (
          <IntelligenceAnalysis
            goBack={() => setPageNumber(0)}
            onContinue={() => setPageNumber(5)}
            transactionData={transactionData}
          />
        ) : pageNumber === 5 ? (
          <EscrowContract
            goBack={() => setPageNumber(0)}
            onContinue={() => setPageNumber(6)}
            transactionData={transactionData}
            setEtherscanLink={setEtherscanLink}
          />
        ) : pageNumber === 11 ? (
          <Notifications goBack={() => setPageNumber(0)} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Page;
