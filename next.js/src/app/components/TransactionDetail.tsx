import React, { useState } from "react";
import * as Label from "@radix-ui/react-label";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { utils } from "ethers";
import {
  selectToken,
  selectTokenDecimals,
  tokensDetails,
} from "../utils/constants";
import ERC20 from "../utils/ERC20.abi.json";

const TransactionDetail: React.FC = () => {
  const [selectedToken, setSelectedToken] = React.useState<{
    label: string;
    decimals: number;
    homestead: string;
    goerli: string;
    optimism: string;
    arbitrum: string;
    matic: string;
  }>(tokensDetails[0]);
  const [amount, setAmount] = useState<string>("");
  const [amountTransactionInput, setAmountTransactionInput] =
    useState<string>("0.01");
  const [recipient, setRecipient] = useState<string>("");
  const [securityLevel, setSecurityLevel] = useState<string>("basic");
  const { chain } = useNetwork();
  const [chainId, setChainId] = React.useState<string>("");
  const [isNativeTx, setIsNativeTx] = React.useState<boolean>(true);
  const [tokenAddress, setTokenAddress] = React.useState<string | undefined>(
    ""
  );
  const [decimals, setDecimals] = React.useState<number | undefined>(0);

  //wagmi native transaction
  const { config: configNative } = usePrepareSendTransaction({
    to: recipient,
    value: amountTransactionInput
      ? BigInt(utils.parseEther(amountTransactionInput).toString())
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
    address: tokenAddress as `0x${string}` | undefined,
    abi: ERC20,
    functionName: "transfer",
    args: [
      recipient,
      BigInt(utils.parseEther(amountTransactionInput).toString()),
    ],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  //wagmi native test transaction
  const { config: configTest } = usePrepareSendTransaction({
    to: recipient,
    value: BigInt(utils.parseEther("0.00169").toString()),
  });
  const { data: dataTest, sendTransaction: sendTransactionTest } =
    useSendTransaction(configTest);

  const { isLoading: isLoadingTest, isSuccess: isSuccessTest } =
    useWaitForTransaction({
      hash: dataTest?.hash,
    });

  const handleAmountChange = (event: any) => {
    const inputValue = event.target.value;
    setAmount(inputValue);

    if (inputValue === "") {
      if (decimals != 18 && decimals) {
        const amount: string = (
          Number("0.001") / Number(10 ** (18 - decimals))
        ).toFixed(18);
        setAmount(amount);
        return;
      } else {
        setAmount("0.001");
        return;
      }
    }

    if (decimals != 18 && decimals) {
      const amountTransactionInput: string = (
        Number(inputValue) / Number(10 ** (18 - decimals))
      ).toFixed(18);
      setAmountTransactionInput(amountTransactionInput);
    } else {
      setAmountTransactionInput(inputValue as string);
    }
  };

  React.useEffect(() => {
    if (chain) {
      setSelectedToken(tokensDetails[0]);
      if (chain.network == "matic") {
        setSelectedToken(tokensDetails[1]);
      }
      setChainId(chain.network);
    }
  }, [chain]);

  React.useEffect(() => {
    if (selectedToken && chain) {
      setTokenAddress(selectToken(selectedToken.label, chain.network));
      setDecimals(selectTokenDecimals(selectedToken.label));
      if (selectedToken.label == "ETH" || selectedToken.label == "MATIC") {
        setIsNativeTx(true);
      } else {
        setIsNativeTx(false);
      }
    }
  }, [selectedToken]);

  return (
    <main className="flex min-h-screen flex-col items-center  justify-between p-24">
      <div className="max-w-5xl w-fit p-4 rounded-xl items-center justify-between border-2 font-sans text-sm lg:flex">
        <div>
          <h1 className="text-2xl font-bold mb-2">{"New Transaction"}</h1>
          <br />
          <Label.Root
            className="text-lg font-semibold mt-6 leading-[35px] text-black"
            htmlFor="amount"
          >
            {" Enter amount & asset"}
          </Label.Root>
          <br />
          <input
            className="bg-blackA2 shadow-blackA6 inline-flex h-[35px] w-[440px] appearance-none items-center justify-center rounded-[4px] rounded-r-none px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black border-r-0"
            type="number"
            id="amount"
            placeholder="0.05"
            min="0.000000000000000001"
            step={0.01}
            value={amount}
            onChange={handleAmountChange}
          />
          <select
            defaultValue="ETH"
            className="h-[35px] bg-blackA2 shadow-blackA6 rounded-r px-[10px]  outline-none focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black leading-none text-black shadow-[0_0_0_1px] border-l-0"
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedToken = tokensDetails.find(
                (token) => token.label === selectedValue
              );
              if (selectedToken) {
                setSelectedToken(selectedToken);
              }
            }}
          >
            {tokensDetails
              .filter((token) => {
                if (chainId === "matic") {
                  return token.label !== "ETH";
                } else {
                  return token.label !== "MATIC";
                }
              })
              .map((token) => (
                <option
                  value={token.label}
                  key={token.label}
                  data-placeholder="0.00"
                >
                  {token.label}
                </option>
              ))}
          </select>
          <br />
          <br />
          <Label.Root
            className="text-lg font-semibold mt-6 leading-[35px] text-black"
            htmlFor="address"
          >
            {"New Address | Address book"}
          </Label.Root>
          <br />
          <input
            className="bg-blackA2 shadow-blackA6 inline-flex h-[35px] w-[520px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black dark:text-white shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black"
            type="text"
            id="address"
            placeholder="Enter Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <br />
          <br />
          <h2 className="text-lg font-semibold my-2">
            {"Select security level"}
          </h2>
          <br />
          <RadioGroup.Root
            className="flex flex-col gap-2.5"
            value={securityLevel}
            aria-label="View density"
          >
            <div className="flex items-center dark:text-white">
              <RadioGroup.Item
                className="bg-sky-100 w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-black hover:bg-sky-300 focus:shadow-[0_0_0_2px] focus:shadow-sky-400 outline-none cursor-default"
                value="basic"
                id="r1"
                onClick={() => setSecurityLevel("basic")}
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:rounded-[50%] after:bg-sky-500" />
              </RadioGroup.Item>
              <label
                className="text-black text-[15px] leading-none pl-[15px]"
                htmlFor="r1"
              >
                {"Basic Security"}
                <br />
                <p className="text-sm font-light">
                  {
                    "Send a test transaction and connect with an account you've never sent funds to before."
                  }
                </p>
              </label>
            </div>
            <div className="flex items-center">
              <RadioGroup.Item
                className="bg-sky-100 w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-black hover:bg-sky-300 focus:shadow-[0_0_0_2px] focus:shadow-sky-500 outline-none cursor-default"
                value="enhanced"
                id="r2"
                onClick={() => setSecurityLevel("enhanced")}
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:rounded-[50%] after:bg-sky-500" />
              </RadioGroup.Item>
              <label
                className="text-black text-[15px] leading-none pl-[15px]"
                htmlFor="r2"
              >
                {"Enhanced Security"}
                <br />
                <p className="text-sm font-light">
                  {
                    "Run an intelligence analysis on a address to see if they are a legitimate account."
                  }
                </p>
              </label>
            </div>
            <div className="flex items-center">
              <RadioGroup.Item
                className="bg-sky-100 w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-black hover:bg-sky-300 focus:shadow-[0_0_0_2px] focus:shadow-sky-400 outline-none cursor-default"
                value="advanced"
                id="r3"
                onClick={() => setSecurityLevel("advanced")}
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:rounded-[50%] after:bg-sky-500" />
              </RadioGroup.Item>
              <label
                className="text-black text-[15px] leading-none pl-[15px]"
                htmlFor="r3"
              >
                {"Advanced Security"}
                <br />
                <p className="text-sm font-light">
                  {
                    "Create an escrow contract which holds funds until a certain condition is met."
                  }
                </p>
              </label>
            </div>
          </RadioGroup.Root>
          <br />
          <br />
          <button className="h-[35px] w-[520px] font-bold hover:bg-sky-500 bg-sky-600 rounded-md text-lg">
            {"Continue"}
          </button>
          <br />
          <br />
          <button
            className="h-[35px] w-[520px] font-bold hover:bg-sky-500 bg-sky-600 rounded-md text-lg"
            disabled={
              isLoadingNative || !sendTransaction || !recipient || !amount
            }
            type="button"
            onClick={isNativeTx ? () => sendTransaction?.() : () => write?.()}
          >
            {isLoadingNative ? "Sending..." : "Send"}
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
          <br />
          <br />
          <button
            className="h-[35px] w-[520px] font-bold hover:bg-sky-500 bg-sky-600 rounded-md text-lg"
            disabled={isLoadingTest || !sendTransactionTest || !recipient}
            type="button"
            onClick={() => sendTransactionTest?.()}
          >
            {isLoadingNative ? "Sending..." : "Send test transaction"}
            {/* Continue */}
          </button>
        </div>
      </div>
    </main>
  );
};

export default TransactionDetail;
