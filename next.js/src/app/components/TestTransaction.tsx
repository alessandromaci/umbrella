import React from "react";
import * as Separator from "@radix-ui/react-separator";
import {
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { utils } from "ethers";
import ERC20 from "../utils/ERC20.abi.json";

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

const TestTransaction: React.FC<{
  goBack: () => void;
  transactionData: TransactionData | undefined;
}> = ({ goBack, transactionData }) => {
  const amount = transactionData?.amount ?? "0"; // default to '0'

  //wagmi native transaction
  const { config: configNative } = usePrepareSendTransaction({
    to: transactionData?.recipient,
    value: transactionData?.amount
      ? BigInt(utils.parseEther(transactionData?.amount).toString())
      : undefined,
  });
  const { data: dataNative, sendTransaction } =
    useSendTransaction(configNative);

  const { isLoading: isLoadingNative, isSuccess: isSuccessNative } =
    useWaitForTransaction({
      hash: dataNative?.hash,
    });

  // wagmi erc20 transaction
  const { config } = usePrepareContractWrite({
    address: transactionData?.recipient as `0x${string}` | undefined,
    abi: ERC20,
    functionName: "transfer",
    args: [
      transactionData?.recipient,
      BigInt(utils.parseEther(amount).toString()),
    ],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  //wagmi native test transaction
  const { config: configTest } = usePrepareSendTransaction({
    to: transactionData?.recipient,
    value: BigInt(utils.parseEther("0.00169").toString()),
  });
  const { data: dataTest, sendTransaction: sendTransactionTest } =
    useSendTransaction(configTest);

  const { isLoading: isLoadingTest, isSuccess: isSuccessTest } =
    useWaitForTransaction({
      hash: dataTest?.hash,
    });

  return (
    <main className="flex min-h-screen flex-col items-center min-w-min justify-between p-24">
      <div className="max-w-fit min-w-min p-4 rounded-xl items-center justify-between border-2 font-sans border-gray-400 text-sm lg:flex">
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
            {"The address is not verified"}
          </h1>
          <p className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
            {
              "Umbrella requires you to send a test transaction on the Goerli Testnet to create a connection. Once the recipient has confirmed this test transaction, they will be added to your address book and you can send verified transactions."
            }
            <br />
            <br />
            {
              "To carry out this test transaction, please make sure you have Goerli ETH."
            }
          </p>
          <br />
          <button
            className="text-lg font-bold rounded-md p-2 text-gray-00 w-[150px] bg-sky-500 mb-8"
            onClick={() => window.open("https://goerlifaucet.com/", "_blank")}
          >
            {"Get Goerli ETH"}
          </button>
          <br />
          <h1 className="text-xl font-bold mb-2">
            {"Test transaction details"}
          </h1>
          <div className="flex flex-row min-w-min h-fit mb-4 gap-2">
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
                {"0.00169 gETH"}
              </p>
            </div>
            <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
              <p className="font-semibold text-gray-950">{"Network:"}</p> &nbsp;
              <p className="text-[14.5px] font-semibold tracking-tighter">
                {"Goerli"}
              </p>
            </div>
          </div>
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">
            {"Full transaction details"}
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
          <button
            className="text-lg font-semibold rounded-md p-2 min-w-min text-gray-00 w-full bg-sky-500 mb-1"
            type="button"
            onClick={() => sendTransactionTest?.()}
          >
            {isLoadingNative ? "Sending..." : "Send Test Transaction"}
          </button>
          {isSuccessNative && (
            <div>
              {`Successfully sent {amount} ether to {recipient}`}
              <div>
                <a href={`https://etherscan.io/tx/${dataNative?.hash}`}>
                  {"Etherscan"}
                </a>
              </div>
            </div>
          )}
          <button
            className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={
              transactionData?.isNativeTx
                ? () => sendTransaction?.()
                : () => write?.()
            }
          >
            {isLoadingNative
              ? "Sending..."
              : "I understand, send full transaction anyway"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default TestTransaction;
