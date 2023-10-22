import React from "react";
import * as Separator from "@radix-ui/react-separator";
import {
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
} from "wagmi";
import { utils } from "ethers";
import ERC20 from "../utils/ERC20.abi.json";
import { setEtherscanBase } from "../utils/constants";
import {
  sendPaymentNotification,
  sendTestPaymentNotification,
} from "../utils/push";

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
  onContinue: () => void;
  onAnalysis: () => void;
  transactionData: TransactionData | undefined;
  setEtherscanLink: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  goBack,
  onContinue,
  onAnalysis,
  transactionData,
  setEtherscanLink,
}) => {
  const amount = transactionData?.amount ?? "0"; // default to '0'
  const { address } = useAccount();

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

  React.useEffect(() => {
    if (isSuccessTest) {
      if (transactionData) {
        const etherscanLink = setEtherscanBase(
          transactionData.chain,
          dataTest?.hash
        );
        sendTestPaymentNotification(address, transactionData, etherscanLink);
        setEtherscanLink(etherscanLink);
        onContinue();
      }
    }
  }, [isSuccessTest]);

  React.useEffect(() => {
    if (isSuccess) {
      if (transactionData) {
        const etherscanLink = setEtherscanBase(
          transactionData.chain,
          data?.hash
        );
        sendPaymentNotification(address, transactionData, etherscanLink);
      }
    }
    if (isSuccessNative) {
      if (transactionData) {
        const etherscanLink = setEtherscanBase(
          transactionData.chain,
          dataNative?.hash
        );
        sendPaymentNotification(address, transactionData, etherscanLink);
      }
    }
  }, [isSuccess, isSuccessNative]);

  return (
    <div className="max-w-fit min-w-min my-16 p-4 text-white rounded-xl items-center justify-between border-2 font-noto border-gray-200 text-sm lg:flex">
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
        <p className="font-semibold  min-w-min w-[500px] mr-8">
          {
            "Umbrella requires you to send a test transaction on Testnet to create a connection. Once the recipient has confirmed this test transaction, they will be added to your address book and you can send verified transactions."
          }
          <br />
          <br />
          {`To carry out this test transaction, please make sure you have ${
            transactionData?.chain == "maticmum" ? "Mumbai MATIC" : "Goerli ETH"
          }`}
        </p>
        <br />
        <button
          className="text-lg font-bold rounded-lg p-2 w-[200px] hover:bg-sky-400 bg-sky-500 mb-8"
          onClick={
            transactionData?.chain == "maticmum"
              ? () => window.open("https://mumbaifaucet.com/", "_blank")
              : () => window.open("https://goerlifaucet.com/", "_blank")
          }
        >
          {`Get ${
            transactionData?.chain == "maticmum" ? "Mumbai MATIC" : "Goerli ETH"
          }`}
        </button>
        <br />
        <h1 className="text-xl font-bold mb-2">{"Test transaction details"}</h1>
        <div className="flex text-black flex-row min-w-min h-fit mb-4 gap-2">
          <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
            <p className="font-semibold">{"Wallet:"}</p> &nbsp;
            <p className="text-[14.5px] font-semibold tracking-tighter">
              {transactionData?.recipient.slice(0, 4)}
              {"...."}
              {transactionData?.recipient.slice(-4)}
            </p>
          </div>
          <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
            <p className="font-semibold text-gray-950">{"Asset:"}</p> &nbsp;
            <p className="text-[14.5px] font-semibold tracking-tighter">
              {`0.00169 ${
                transactionData?.chain == "maticmum" ? "MATIC" : "ETH"
              }`}
            </p>
          </div>
          <div className="border border-black h-fit flex flex-row rounded-2xl bg-gray-200 py-0 px-2">
            <p className="font-semibold text-gray-950">{"Network:"}</p> &nbsp;
            <p className="text-[14.5px] font-semibold tracking-tighter">
              {transactionData?.chain == "maticmum" ? "maticmum" : "goerli"}
            </p>
          </div>
        </div>
        <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
        <h1 className="text-xl font-bold mb-2">{"Full transaction details"}</h1>
        <div className="flex text-black flex-row min-w-min h-fit mb-12 gap-2">
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
          className="text-lg font-semibold rounded-lg p-2 min-w-min text-gray-00 w-full hover:bg-sky-400 bg-sky-500 mb-2"
          type="button"
          onClick={() => sendTransactionTest?.()}
        >
          {isLoadingTest ? "Sending..." : "Send Test Transaction"}
        </button>
        {transactionData?.securityLevel == "enhanced" ? (
          <button
            className="text-lg font-semibold rounded-lg border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={onAnalysis}
          >
            {"Skip the testing. Run analysiss"}
          </button>
        ) : (
          <button
            className="text-lg font-semibold rounded-lg  hover:text-sky-400 hover:border-sky-400 border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
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
        )}

        {isSuccessNative && (
          <div className="font-semibold mt-3 text-gray-400 min-w-min w-[500px] mr-8">
            {`Payment successful! Check your transaction on `}

            <a className="link text-sky-700 hover:text-sky-600" href={`https://etherscan.io/tx/${dataNative?.hash}`}>
              {"Etherscan"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestTransaction;
