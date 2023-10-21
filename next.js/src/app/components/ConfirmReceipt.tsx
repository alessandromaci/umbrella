import React from "react";
import * as Separator from "@radix-ui/react-separator";

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

const ConfirmReceipt: React.FC<{
  goBack: () => void;
  onContinue: () => void;
  transactionData: TransactionData | undefined;
  etherscanLink: string;
}> = ({ goBack, onContinue, transactionData, etherscanLink }) => {
  return (
    <div className="flex text-white min-h-screen flex-col items-center min-w-min justify-between p-6">
      <div className="max-w-fit min-w-min p-4 rounded-xl items-center justify-between border-2 font-noto border-gray-400 text-sm lg:flex">
        <div className="w-full min-w-min">
          <button
            type="button"
            onClick={goBack}
            className="text-blue-600 font-semibold"
          >
            {"Back"}
          </button>
          <br />
          <br />
          <h1 className="text-3xl font-bold mb-2">
            {"Test transaction sent!"}
          </h1>
          <p className="font-semibold text-gray-200 min-w-min w-[500px] mr-8">
            {
              "Your test transaction has been sent to the reciepient. Once they have confirmed the transaction, you may add them to your address book and begin to send them verified and safe transactions. Check the receipt here "
            }
            <a href={etherscanLink}>{"Etherscan"}</a>
          </p>
          <br />
          <br />
          <h1 className="text-xl font-bold mb-2">
            {"Test transaction details"}
          </h1>
          <div className="flex text-gray-950 flex-row min-w-min h-fit mb-8 gap-2">
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-medium">{"Wallet:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {transactionData?.recipient.slice(0, 4)}
                {"...."}
                {transactionData?.recipient.slice(-4)}
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-medium">{"Asset:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {"0.00169 gETH"}
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-medium text-gray-950">{"Network:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {"goerli"}
              </p>
            </div>
          </div>
          <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">
            {"Full transaction details"}
          </h1>
          <div className="flex text-gray-950 flex-row min-w-min h-fit mb-8 gap-2">
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-medium">{"Wallet:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {transactionData?.recipient.slice(0, 4)}
                {"...."}
                {transactionData?.recipient.slice(-4)}
              </p>
            </div>
            <div className="border text-gray-950 border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-medium">{"Asset:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {`${transactionData?.amount} ${transactionData?.token}`}
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-medium">{"Network:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {transactionData?.chain}
              </p>
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">{"Status: Pending"}</h1>
          <p className="font-semibold min-w-min w-[500px] mr-8">
            {
              "Did you receive the test payment confirmation from the recipient?"
            }
          </p>
          <br />
          <br />
          <button
            className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={onContinue}
          >
            {"Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReceipt;
