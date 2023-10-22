import React, { useState } from "react";
import * as Label from "@radix-ui/react-label";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Tabs from "@radix-ui/react-tabs";
import { useNetwork, useAccount } from "wagmi";
import {
  selectToken,
  selectTokenDecimals,
  tokensDetails,
} from "../utils/constants";
import { Database } from "@tableland/sdk";
import { createAddressBook } from "../hooks/createAddressBook";
import { useSigner } from "../hooks/useSigner";

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

interface Schema {
  a_id: number;
  b_ownerAddressBook: string;
  c_recipientAddress: string;
  d_name: string;
}

const StartPage: React.FC<{
  onContinue: () => void;
  setTransactionData: React.Dispatch<
    React.SetStateAction<TransactionData | undefined>
  >;
}> = ({ onContinue, setTransactionData }) => {
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
    useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [securityLevel, setSecurityLevel] = useState<string>("basic");
  const { chain } = useNetwork();
  const [chainId, setChainId] = React.useState<string>("");
  const [isNativeTx, setIsNativeTx] = React.useState<boolean>(true);
  const [tokenAddress, setTokenAddress] = React.useState<string | undefined>(
    ""
  );
  const [decimals, setDecimals] = React.useState<number | undefined>(0);
  const [errors, setErrors] = React.useState<{
    recipient: string;
    amount: string;
  }>({ recipient: "", amount: "" });
  const { address } = useAccount();
  const signer = useSigner();
  const [addressBook, setAddressBook] = useState<Record<string, string>>({});

  const handleAmountChange = (inputValue: any) => {
    setAmount(inputValue);

    if (decimals != 18 && decimals) {
      const amountTransactionInput: string = (
        Number(inputValue) / Number(10 ** (18 - decimals))
      ).toFixed(18);
      setAmountTransactionInput(amountTransactionInput);
    } else {
      setAmountTransactionInput(inputValue as string);
    }
  };

  const handleContinue = () => {
    let newErrors = { recipient: "", amount: "" };

    if (recipient === "") {
      newErrors.recipient = "Recipient address is required.";
    }
    if (amountTransactionInput === "") {
      newErrors.amount = "Amount is required.";
    }

    if (newErrors.recipient || newErrors.amount) {
      setErrors(newErrors);
      console.log("not good");
      return;
    }

    setTransactionData({
      recipient: recipient,
      amount: amountTransactionInput,
      token: selectedToken.label,
      chain: chainId,
      tokenAddress: tokenAddress,
      decimals: decimals,
      securityLevel: securityLevel,
      isNativeTx: isNativeTx,
    });

    onContinue();
  };

  React.useEffect(() => {
    if (chain) {
      setSelectedToken(tokensDetails[0]);
      if (chain.network == "matic" || chain.network == "maticmum") {
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

  React.useEffect(() => {
    const fetchData = async () => {
      const db: Database<Schema> = new Database({ signer });
      const prefix: string = `umbrella_addressBook_80001_7918`;
      const { results } = await db.prepare(`SELECT * FROM ${prefix};`).all();

      const addressBook = createAddressBook(results, address);
      console.log(addressBook);
      setAddressBook(addressBook);
    };

    fetchData();
  }, [address]);

  return (
    <div className="max-w-fit text-white w-full max-h-90 p-4 rounded-xl items-center justify-between border-2 font-noto text-sm lg:flex">
      <div>
        <h1 className="text-3xl ml-5 mt-3 font-bold mb-2">New Transaction</h1>
        <br />
        <div className="center">
          <Label.Root
            className="text-lg font-semibold mt-6 ml-5 leading-[35px]"
            htmlFor="amount"
          >
            {" Enter amount & asset"}
          </Label.Root>
          <br />
          <input
            className=" inline-flex ml-5 h-[35px] w-[450px] appearance-none items-center justify-center rounded-[4px] rounded-r-none px-[10px] text-[15px]  leading-none shadow-[0_0_0_1px] bg-zinc-900 shadow-sky-400  focus:shadow-[0_0_0_2px] focus:shadow-sky-500  outline-none  border-r-0"
            type="number"
            id="amount"
            placeholder="0.05"
            min="0.00001"
            step={0.01}
            value={amount}
            onChange={(e) => {
              handleAmountChange(e.target.value);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
          />
          <select
            defaultValue="ETH"
            className="h-[35px] px-[10px] rounded-r  leading-none text-[15px] bg-zinc-900 shadow-[0_0_0_1px] shadow-sky-400 focus:shadow-[0_0_0_2px] focus:shadow-sky-500  outline-none"
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
                } else if (chainId === "maticmum") {
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
          {errors.amount && (
            <p className="text-red-500 mt-2">{errors.amount}</p>
          )}
        </div>
        <br />
        <Label.Root
          className="text-lg font-semibold mt-6 leading-[35px]"
          htmlFor="address"
        >
          <Tabs.Root className="flex flex-col w-full" defaultValue="newAddress">
            <Tabs.List
              className="shrink-0 flex border-b border-mauve6"
              aria-label="Manage your account"
            >
              <Tabs.Trigger
                className="bg-zinc-900 text-gray-400 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none select-none first:rounded-tl-md last:rounded-tr-md hover:text-sky-500 data-[state=active]:text-white data-[state=active]:shadow-sky-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:focus:relative outline-none cursor-default"
                value="newAddress"
              >
                {"New Address"}
              </Tabs.Trigger>
              <Tabs.Trigger
                className="bg-zinc-900 text-gray-400 px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none select-none first:rounded-tl-md last:rounded-tr-md hover:text-sky-500 data-[state=active]:text-white data-[state=active]:shadow-sky-500 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:focus:relative outline-none cursor-default"
                value="addressBook"
              >
                {"Address Book"}
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content
              className="grow p-5 bg-zinc-900 rounded-b-md outline-none "
              value="newAddress"
            >
              <fieldset className="mb-2 w-full flex flex-col justify-start">
                <input
                  className="grow bg-zinc-900 shrink-0 w-full rounded px-2.5 text-[15px] leading-none text-gray-200 shadow-[0_0_0_1px] shadow-sky-400 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-sky-500 outline-none"
                  id="address"
                  placeholder="0x..."
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setErrors((prev) => ({ ...prev, recipient: "" }));
                  }}
                />
              </fieldset>
            </Tabs.Content>
            <Tabs.Content
              className="grow p-5 bg-zinc-900 rounded-b-md outline-none"
              value="addressBook"
            >
              <fieldset className="mb-2 w-full flex flex-col justify-start">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    setRecipient(e.target.value);
                  }}
                  className="grow shrink-0 bg-zinc-900 text-gray-200 rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] shadow-sky-400 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-sky-500 outline-none"
                >
                  <option key={address} value={address}>
                    {`-- select verified address --`}
                  </option>
                  {Object.entries(addressBook).map(([address, name]) => (
                    <option key={address} value={address}>
                      {`${name}.umbrella`}
                    </option>
                  ))}
                </select>
              </fieldset>
            </Tabs.Content>
          </Tabs.Root>
        </Label.Root>
        {errors.recipient && (
          <p className="text-red-500 mt-2">{errors.recipient}</p>
        )}
        <div className="ml-5">
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
                className="text-[15px] leading-none pl-[15px]"
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
                className="text-[15px] leading-none pl-[15px]"
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
                className="text-[15px] leading-none pl-[15px]"
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
        </div>
        <br />
        <button
          type="button"
          onClick={handleContinue}
          className="h-[35px] w-full font-bold hover:bg-sky-400 bg-sky-500 rounded-md text-lg"
        >
          {"Continue"}
        </button>
      </div>
    </div>
  );
};

export default StartPage;
