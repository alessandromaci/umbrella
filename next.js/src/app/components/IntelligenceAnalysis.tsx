import React from "react";
import * as Separator from "@radix-ui/react-separator";
import { utils } from "ethers";
import {
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
} from "wagmi";
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

interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

const IntelligenceAnalysis: React.FC<{
  goBack: () => void;
  onContinue: () => void;
  transactionData: TransactionData | undefined;
}> = ({ goBack, onContinue, transactionData }) => {
  const [isAnalysisCompleted, setIsAnalysisCompleted] =
    React.useState<boolean>(false);
  const [report, setReport] = React.useState<any>();
  const amount = transactionData?.amount ?? "0";

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

  const handleAnalysis = async () => {
    setIsAnalysisCompleted(false);
    if (transactionData) {
      const recipient = transactionData.recipient;
      const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
      if (!apiKey) {
        console.error("Etherscan API key is not set");
        return;
      }
      const url = `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${recipient}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error("Failed to fetch transaction history from Etherscan");
          return;
        }
        const data = await response.json();
        if (data.status !== "1") {
          console.error("Etherscan API returned an error:", data.message);
          return;
        }
        const history: EtherscanTransaction[] = data.result;
        const report = analyzeHistory(history);
        setReport(report);
        console.log("Our report", report);
      } catch (error) {
        console.error(
          "Failed to fetch transaction history from Etherscan",
          error
        );
      }
    }
    setIsAnalysisCompleted(true);
  };

  const analyzeHistory = (history: EtherscanTransaction[]): any => {
    // A low number of transaction might indicate that the recipient has not used this account regularly
    const numberOfTransactions = history.length;

    //This can give an idea of the typical amount of funds the recipient handles.
    //A low number of transactions with high values or vice versa could be suspicious.
    const totalValue = history.reduce(
      (acc, tx) => acc + parseFloat(utils.formatEther(tx.value)),
      0
    );
    const averageTransactionValue = totalValue / numberOfTransactions;

    // If the recipient has transactions at regular intervals, it may indicate automated or recurring payments, which is generally normal.
    //However, if there are sudden bursts of transactions, it may require further investigation.
    const timestamps = history.map((tx) => parseInt(tx.timeStamp) * 1000);
    const timeIntervals = timestamps
      .slice(1)
      .map((time, index) => time - timestamps[index]);
    const averageTimeInterval =
      timeIntervals.reduce((a, b) => a + b, 0) / timeIntervals.length;

    const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
    const averageTimeIntervalInDays =
      averageTimeInterval / MILLISECONDS_IN_A_DAY;

    // A consistently high gas price might indicate the recipient is willing to pay more to expedite their transactions, which could be seen as suspicious.
    const highGasPrices = history.filter(
      (tx) => parseFloat(utils.formatEther(tx.gasPrice)) > 100
    ).length;

    // Interactions with unknown or suspicious contracts could be a red flag.
    const contractInteractions = history.filter(
      (tx) => tx.to && tx.input !== "0x"
    ).length;

    return {
      "number of transactions found": numberOfTransactions,
      "average transaction value (ETH)": averageTransactionValue,
      "average time interval between transactions (days)":
        averageTimeIntervalInDays,
      "number of transactions with gas price > 100 Gwei": highGasPrices,
      "number of contract interactions": contractInteractions,
    };
  };

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
          <h1 className="text-3xl font-bold mb-2">{"Intelligence Analysis"}</h1>
          <p className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
            {
              "Umbrella requires you to run an analyis of the recipient address to verify that there are no suspicious activity"
            }
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
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">{"Analysis Report"}</h1>
          {isAnalysisCompleted && report && (
            <div>
              {Object.entries(report).map(([key, value]) => (
                <p
                  className="font-semibold text-gray-950 min-w-min w-[500px] mr-8"
                  key={key}
                >
                  {`${key}: ${value}`}
                </p>
              ))}
            </div>
          )}

          <br />
          {isAnalysisCompleted ? (
            transactionData?.securityLevel == "advanced" ? (
              <button
                className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
                type="button"
                onClick={onContinue}
              >
                {"Continue"}
              </button>
            ) : (
              <button
                className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
                type="button"
                onClick={
                  transactionData?.isNativeTx
                    ? () => sendTransaction?.()
                    : () => write?.()
                }
              >
                {isLoadingNative ? "Sending..." : "Send Transaction"}
              </button>
            )
          ) : (
            <button
              className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
              type="button"
              onClick={handleAnalysis}
            >
              {"Generate report"}
            </button>
          )}
          <br />
          <br />
          {isSuccessNative && (
            <div className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
              {`Payment successful! Check your transaction on `}

              <a href={`https://etherscan.io/tx/${dataNative?.hash}`}>
                {"Etherscan"}
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default IntelligenceAnalysis;
