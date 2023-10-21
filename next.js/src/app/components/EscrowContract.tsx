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
import EscrowContractABI from "../utils/EscrowContract.abi.json";

import { setEtherscanBase } from "../utils/constants";
import { sendPaymentNotification } from "../utils/push";
//import { uploadIpfs } from "../utils/ipfs";

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

const EscrowContract: React.FC<{
  goBack: () => void;
  onContinue: () => void;
  transactionData: TransactionData | undefined;
}> = ({ goBack, onContinue, transactionData }) => {
  const amount = transactionData?.amount ?? "0"; // default to '0'
  const [name, setName] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>("");
  const [evidence, setEvidence] = React.useState<any>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);

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

  //create contract agreement (mumbai)
  const { config: createAgreement } = usePrepareContractWrite({
    address: "0xf0b1c1b99f2d9c94a57ec2da45915cf1fd3e47a7",
    abi: EscrowContractABI,
    functionName: "createAgreement",
    args: [
      address,
      transactionData?.recipient,
      BigInt(utils.parseEther(amount).toString()),
      transactionData?.tokenAddress,
      evidence,
    ],
  });

  const { data: dataCreateAgreement, write: writeCreateAgreement } =
    useContractWrite(createAgreement);

  const {
    isLoading: isLoadingCreateAgreement,
    isSuccess: isSuccessCreateAgreement,
  } = useWaitForTransaction({
    hash: dataCreateAgreement?.hash,
  });

  const createAgreementRequest = async () => {
    setIpfsLoading(true);
    const data = {
      contractName: name,
      contractTerms: terms,
      from: address,
      value: amount,
      tokenAddress: transactionData?.tokenAddress,
    };
    try {
      const response = await fetch("/api/pinToPinata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Pinned data:", result);
      setIpfsLoading(false);
    } catch (error) {
      console.error("Error pinning data to Pinata:", error);
      setIpfsLoading(false);
    }
  };

  //   React.useEffect(() => {
  //     if (isSuccess) {
  //       if (transactionData) {
  //         const etherscanLink = setEtherscanBase(
  //           transactionData.chain,
  //           data?.hash
  //         );
  //         sendPaymentNotification(address, transactionData, etherscanLink);
  //       }
  //     }
  //     if (isSuccessNative) {
  //       if (transactionData) {
  //         const etherscanLink = setEtherscanBase(
  //           transactionData.chain,
  //           dataNative?.hash
  //         );
  //         sendPaymentNotification(address, transactionData, etherscanLink);
  //       }
  //     }
  //   }, [isSuccess, isSuccessNative]);

  return (
    <div className="max-w-fit min-w-min p-4 rounded-xl items-center justify-between border-2 font-sans border-gray-400 text-sm lg:flex">
      <div className="w-full min-w-min">
        <button
          type="button"
          onClick={goBack}
          className="text-blue-600 font-semibold hover:underline mb-3 text-base"
        >
          {"Back"}
        </button>
        <h1 className="text-3xl font-bold mb-2">{"Create Escrow Contract"}</h1>
        <p className="font-semibold text-gray-950 min-w-min w-[450px]">
          {
            "Escrow contracts are the last step of advanced security, giving you a further level of protection by utilising third party smart contract to hold funds until a job is completed."
          }
          <br />
          <br />
          <a className="link text-blue-600 underline font-medium " href="">
            {"What is an Escrow Contract?"}
          </a>
        </p>
        <br />
        <h1 className="text-lg font-bold mb-2">{"Transaction details"}</h1>
        <div className="flex flex-col min-w-min font-medium h-fit mb-4 gap-2">
          <div className="h-fit flex flex-row rounded-2xl py-0 px-2">
            <p className="text-gray-950">{"Wallet:"}</p> &nbsp;
            <p className="tracking-tighter">
              {" "}
              {transactionData?.recipient.slice(0, 4)}
              {"...."}
              {transactionData?.recipient.slice(-4)}
            </p>
          </div>
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[1px]" />
          <div className="h-fit flex flex-row rounded-2xl py-0 px-2">
            <p className="text-gray-950">{"Asset:"}</p> &nbsp;
            <p className="tracking-tighter">{`${transactionData?.amount} ${transactionData?.token}`}</p>
          </div>
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[1px]" />
          <div className="h-fit flex flex-row rounded-2xl py-0 px-2">
            <p className="text-gray-950">{"Network:"}</p> &nbsp;
            <p className="tracking-tighter">{transactionData?.chain}</p>
          </div>
        </div>
        <h1 className="text-lg font-bold mb-2">{"Contract details"}</h1>
        <p className="text-base font-medium leading-[35px] text-black">
          {"Name of Contract"}
        </p>
        <input
          className="grow shrink-0 w-full rounded px-2.5 text-[15px] leading-none text-sky-600 shadow-[0_0_0_1px] shadow-sky-500 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-sky-600 mb-4 outline-none"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name of Contract"
        />
        <p className="text-base font-medium leading-[35px] text-black">
          {"Contract Terms"}
        </p>
        <input
          className="grow shrink-0 w-full rounded px-2.5 text-[15px] leading-none text-sky-600 shadow-[0_0_0_1px] shadow-sky-500 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-sky-600 mb-4 outline-none"
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          placeholder="I expect to..."
        />
        <div className="h-fit flex flex-row rounded-2xl gap-4 py-0 mb-4">
          <button className="text-md font-semibold rounded-lg h-fit border min-w-min p-2 border-sky-500 text-gray-00 w-[35%] hover:bg-sky-400 bg-sky-500 mb-1">
            {"Use Template"}
          </button>
          {/* <button className="text-md font-semibold rounded-lg h-fit border min-w-min border-sky-500 p-2 bg-gray-00 w-[35%] hover:text-sky-400 hover:border-sky-400 text-sky-500 mb-1">
            {"Create New"}
          </button> */}
        </div>

        <button
          className="text-lg font-semibold rounded-lg p-2 min-w-min text-gray-00 w-full hover:bg-sky-400 bg-sky-500 mb-1"
          type="button"
          onClick={() => {
            createAgreementRequest();
          }}
        >
          {/* writeCreateAgreement?.();  */}
          {"Send Contract"}
        </button>
      </div>
    </div>
  );
};

export default EscrowContract;
