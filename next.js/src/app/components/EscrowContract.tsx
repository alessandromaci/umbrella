import React from "react";
import * as Separator from "@radix-ui/react-separator";
import { useWaitForTransaction, useContractWrite, useAccount } from "wagmi";
import { utils } from "ethers";
import EscrowContractABI from "../utils/EscrowContract.abi.json";

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
  transactionData: TransactionData | undefined;
  etherscanLink: string;
}> = ({ goBack, transactionData, etherscanLink }) => {
  const amount = transactionData?.amount ?? "0"; // default to '0'
  const [name, setName] = React.useState<string>("");
  const [terms, setTerms] = React.useState<string>("");
  const [evidence, setEvidence] = React.useState<any>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);

  const { address } = useAccount();

  // ----create agreement function mumbai----
  const {
    data: dataCreateAgreement,
    write: writeCreateAgreement,
    error,
  } = useContractWrite({
    address: "0xf0b1c1b99f2d9c94a57ec2da45915cf1fd3e47a7",
    abi: EscrowContractABI,
    functionName: "createAgreement",
    args: [
      address,
      transactionData?.recipient,
      BigInt(utils.parseEther(amount).toString()),
      "0x0000000000000000000000000000000000000001",
      evidence,
    ],
    value: BigInt(utils.parseEther(amount).toString()),
  });

  const {
    isLoading: isLoadingCreateAgreement,
    isSuccess: isSuccessCreateAgreement,
  } = useWaitForTransaction({
    hash: dataCreateAgreement?.hash,
  });

  // ----confirms agreement completed function mumbai----
  const {
    data: dataConfirmReceived,
    write: confirmReceived,
    error: errorConfirmReceived,
  } = useContractWrite({
    address: "0xf0b1c1b99f2d9c94a57ec2da45915cf1fd3e47a7",
    abi: EscrowContractABI,
    functionName: "confirmReceived",
    args: [3],
  });

  const {
    isLoading: isLoadingConfirmReceived,
    isSuccess: isSuccessConfirmReceived,
  } = useWaitForTransaction({
    hash: dataConfirmReceived?.hash,
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
    // You can replace `any` with your data's type
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
      setEvidence(result);
      console.log("Pinned data:", result);
      setIpfsLoading(false);
    } catch (error) {
      console.error("Error pinning data to Pinata:", error);
      setIpfsLoading(false);
    }
  };

  return (
    <div className="max-w-fit min-w-min p-4 rounded-xl items-center justify-between border-2 text-white font-sans border-gray-400 text-sm lg:flex">
      <div className="w-full min-w-min">
        <button
          type="button"
          onClick={goBack}
          className="text-blue-600 font-semibold hover:underline mb-3 text-base"
        >
          {"Back"}
        </button>
        <h1 className="text-3xl font-bold mb-2">{"Create Escrow Contract"}</h1>
        <p className="font-semibold min-w-min w-[600px]">
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
            <p>{"Wallet:"}</p> &nbsp;
            <p className="tracking-tighter">
              {" "}
              {transactionData?.recipient.slice(0, 4)}
              {"...."}
              {transactionData?.recipient.slice(-4)}
            </p>
          </div>
          <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[1px]" />
          <div className="h-fit flex flex-row rounded-2xl py-0 px-2">
            <p>{"Asset:"}</p> &nbsp;
            <p className="tracking-tighter">{`${transactionData?.amount} ${transactionData?.token}`}</p>
          </div>
          <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[1px]" />
          <div className="h-fit flex flex-row rounded-2xl py-0 px-2">
            <p>{"Network:"}</p> &nbsp;
            <p className="tracking-tighter">{transactionData?.chain}</p>
          </div>
        </div>
        <h1 className="text-lg font-bold mb-2">{"Contract details"}</h1>
        {isSuccessCreateAgreement ? (
          <p>
            {"Contract name: "}
            {name}
          </p>
        ) : (
          <>
            <p className="text-base font-medium leading-[35px]">
              {"Name of Contract"}
            </p>
            <input
              className="grow shrink-0 w-full rounded px-2.5 text-[15px] bg-zinc-900 leading-none text-sky-600 shadow-[0_0_0_1px] shadow-sky-500 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-sky-600 mb-4 outline-none"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of Contract"
            />
          </>
        )}

        {isSuccessCreateAgreement ? (
          <p>
            {"Contract terms:"} {evidence.IpfsHash}
          </p>
        ) : (
          <>
            <p className="text-base font-medium leading-[35px]">
              {"Contract Terms"}
            </p>
            <input
              className="grow shrink-0 w-full rounded px-2.5 text-[15px] bg-zinc-900 leading-none text-sky-600 shadow-[0_0_0_1px] shadow-sky-500 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-sky-600 mb-4 outline-none"
              id="terms"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="I expect to..."
            />
          </>
        )}
        {!isSuccessCreateAgreement && (
          <div className="h-fit flex flex-row rounded-2xl gap-4 py-0 mb-4">
            <button className="text-md font-semibold rounded-lg h-fit border min-w-min p-2 border-sky-500 text-gray-00 w-[35%] hover:bg-sky-400 bg-sky-500 mb-1">
              {"Use Template"}
            </button>
            {/* <button className="text-md font-semibold rounded-lg h-fit border min-w-min border-sky-500 p-2 bg-gray-00 w-[35%] hover:text-sky-400 hover:border-sky-400 text-sky-500 mb-1">
            {"Create New"}
          </button> */}
          </div>
        )}

        {isSuccessCreateAgreement ? (
          <>
            <button
              className="text-lg font-semibold rounded-lg p-2 min-w-min text-gray-00 w-full hover:bg-sky-400 bg-sky-500 mb-1"
              type="button"
              onClick={() => {
                confirmReceived?.();
              }}
            >
              {isLoadingConfirmReceived ? "Confirming..." : "Confirm receipt"}
            </button>
            <button
              className="text-lg font-semibold rounded-lg p-2 min-w-min text-gray-00 w-full hover:bg-sky-400 bg-sky-500 mb-1"
              type="button"
              onClick={() => {
                console.log("judge called");
              }}
            >
              {"I didn't receive it. Call judge"}
            </button>
            {isSuccessConfirmReceived && (
              <>
                {" "}
                <p>{`Contract confirmed. Money sent to the recipient! Check`}</p>{" "}
                <a
                  href={`https://mumbai.polygonscan.com/tx/${dataConfirmReceived?.hash}`}
                >
                  {"Etherscan"}
                </a>
              </>
            )}
          </>
        ) : (
          <>
            <button
              className="text-lg font-semibold rounded-lg p-2 min-w-min text-gray-00 w-full hover:bg-sky-400 bg-sky-500 mb-1"
              type="button"
              onClick={() => {
                createAgreementRequest();
                writeCreateAgreement?.();
                console.log(error);
              }}
            >
              {isLoadingCreateAgreement ? "Sending..." : "Send Contract"}
            </button>
            {isSuccessCreateAgreement && <p>{"Contract created!"}</p>}
            {error && <p>{"An error occurred preparing the transaction"}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default EscrowContract;
