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
    <main className="flex min-h-screen flex-col items-center min-w-min justify-between p-24">
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
          <p className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
            {
              "Your test transaction has been sent to the reciepient. Once they have confirmed the transaction, you may add them to your address book and begin to send them verified and safe transactions. Check the receipt here "
            }
            <a href={etherscanLink}>{"Etherscan"}</a>
          </p>
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">
            {"Test transaction details"}
          </h1>
          <div className="flex flex-row min-w-min h-fit mb-12 gap-2">
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">{"Wallet:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {transactionData?.recipient.slice(0, 4)}
                {"...."}
                {transactionData?.recipient.slice(-4)}
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">{"Asset:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {`${transactionData?.amount} ${transactionData?.token}`}
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">{"Network:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {transactionData?.chain}
              </p>
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">{"Status: Pending"}</h1>
          <p className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
            {"Did you receive the confirmation from the recipient?"}
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
    </main>
  );
};

export default ConfirmReceipt;
