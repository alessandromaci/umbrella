import React from "react";
import * as Separator from "@radix-ui/react-separator";

const TransactionDetail2: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center min-w-min justify-between p-24">
      <div className="max-w-fit min-w-min p-4 rounded-xl items-center justify-between border-2 font-sans border-gray-400 text-sm lg:flex">
        <div className="w-full min-w-min">
          <p className="text-blue-600 font-semibold">Back</p>
          <br />
          <h1 className="text-3xl font-bold mb-2">
            The address is not verified
          </h1>
          <p className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
            Umbrella requires you to send a test transaction on the Goerli
            Testnet to create a connection. Once the recipient has confirmed
            this test transaction, they will be added to your address book and
            you can send verified transactions.
            <br />
            <br />
            To carry out this test transaction, please make sure you have Goerli
            ETH.
          </p>
          <br />
          <button className="text-lg font-bold rounded-md p-2 text-gray-00 w-[150px] bg-sky-500 mb-8">
            Get Goerli ETH
          </button>
          <br />
          <h1 className="text-xl font-bold mb-2">Test transaction details</h1>
          <div className="flex flex-row min-w-min h-fit mb-4 gap-2">
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">Wallet:</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                0x4C7....0263
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">Asset:</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                1.04 gETH
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">Network:</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                Goerli
              </p>
            </div>
          </div>
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">Full transaction details</h1>
          <div className="flex flex-row min-w-min h-fit mb-12 gap-2">
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">Wallet:</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                0x4C7....0263
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">Asset:</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                0.4 ETH
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">Network:</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                Ethereum
              </p>
            </div>
          </div>
          <button className="text-lg font-semibold rounded-md p-2 min-w-min text-gray-00 w-full bg-sky-500 mb-1">
            Send Transaction
          </button>
          <button className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500">
            I understand, send full transaction anyway
          </button>
        </div>
      </div>
    </main>
  );
};

export default TransactionDetail2;
