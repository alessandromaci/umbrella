import React from "react";
import { Database } from "@tableland/sdk";
import * as Separator from "@radix-ui/react-separator";
import { useSigner } from "../hooks/useSigner";
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

const AddressBook: React.FC<{
  goBack: () => void;
  onContinue: () => void;
  transactionData: TransactionData | undefined;
}> = ({ goBack, onContinue, transactionData }) => {
  const [recipientName, setRecipientName] = React.useState<string>("");
  const { address } = useAccount();
  const signer = useSigner();
  const [isAdding, setIsAdding] = React.useState<boolean>(false);
  const [isNewContactAdded, setIsNewContactAdded] =
    React.useState<boolean>(false);
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

  const handleSaveAddress = async () => {
    const db: Database<Schema> = new Database({ signer });
    const prefix: string = `umbrella_addressBook_80001_7918`;
    setIsAdding(true);
    const { results: resultsFirst } = await db
      .prepare(`SELECT * FROM ${prefix};`)
      .all();

    const index: number = resultsFirst.length;

    // const { meta: create } = await db
    //   .prepare(
    //     `CREATE TABLE ${prefix} (a_id integer primary key, b_ownerAddressBook text, c_recipientAddress text, d_name text);`
    //   )
    //   .run();

    // await create.txn?.wait();
    // console.log(create.txn?.name);

    const { meta: insert } = await db
      .prepare(
        `INSERT INTO ${prefix} (a_id, b_ownerAddressBook, c_recipientAddress, d_name) VALUES (?, ?, ?, ?);`
      )
      .bind(index, address, transactionData?.recipient, recipientName)
      .run();

    // Wait for transaction finality
    await insert.txn?.wait();

    setIsAdding(false);
    setIsNewContactAdded(true);

    // Perform a read query, requesting all rows from the table
    const { results } = await db.prepare(`SELECT * FROM ${prefix};`).all();
    console.log(`results`, results);
  };

  return (
    <main className="flex min-h-screen text-white flex-col items-center min-w-min justify-between p-24">
      <div className="max-w-fit min-w-min p-4 rounded-xl items-center justify-between border-2 font-sans border-gray-400 text-sm lg:flex">
        <div className="w-full min-w-min">
          <button
            type="button"
            onClick={goBack}
            className="text-blue-600 hover:underline font-semibold"
          >
            {"Back"}
          </button>
          <br />
          <br />
          <h1 className="text-3xl font-bold mb-2">
            {"Test transaction confirmed!"}
          </h1>
          <p className="font-semibold text-gray-200 min-w-min w-[500px] mr-8">
            {
              "Your test transaction has been confirmed, you may now send the full transaction to your verified contact. Once the transaction is sent, you can add them to your address book to easily send payments in the future"
            }
          </p>
          <Separator.Root className="bg-gray-400 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">
            {"Add recepient to address book"}
          </h1>
          <input
            className="bg-zinc-900 text-gray-200 shadow-blackA6 inline-flex h-[35px] w-[520px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none dark:text-white shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black"
            type="text"
            id="address"
            placeholder="Name of contact"
            value={recipientName}
            onChange={(e) => {
              setRecipientName(e.target.value);
            }}
          />
          {/* {errors.recipient && (
            <p className="text-red-500 mt-2">{errors.recipient}</p>
          )} */}
          <br />
          <br />
          {isNewContactAdded ? (
            <p>Contact added!</p>
          ) : (
                    <button
            className="text-lg font-semibold rounded-lg border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={handleSaveAddress}
          >
            {isAdding ? "Adding contact" : "Add recipient to address book"}
          </button>
          )}
          <br />
          <br />
          <button
            className="text-lg font-semibold rounded-lg border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={
              transactionData?.securityLevel == "enhanced" ||
              transactionData?.securityLevel == "advanced"
                ? onContinue
                : transactionData?.isNativeTx
                ? () => sendTransaction?.()
                : () => write?.()
            }
          >
            {transactionData?.securityLevel == "enhanced" ||
            transactionData?.securityLevel == "advanced"
              ? "Continue"
              : "Send Transaction"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AddressBook;
