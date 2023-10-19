import React from "react";
import { Database } from "@tableland/sdk";
import * as Separator from "@radix-ui/react-separator";
import { useAccount } from "wagmi";
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

const AddressBook: React.FC<{
  goBack: () => void;
  transactionData: TransactionData | undefined;
}> = ({ goBack, transactionData }) => {
  const [recipientName, setRecipientName] = React.useState<string>("");
  const { address } = useAccount();
  const signer = useSigner();

  const [showConfirmation, setShowConfirmation] =
    React.useState<boolean>(false);

  const handleSaveAddress = async () => {
    const db: Database<Schema> = new Database({ signer });
    const prefix: string = `umbrella_addressBook_80001_7918`;
    setShowConfirmation(false);
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

    setShowConfirmation(true);

    // Perform a read query, requesting all rows from the table
    const { results } = await db.prepare(`SELECT * FROM ${prefix};`).all();
    console.log(`results`, results);
    console.log(results.length);
  };

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
            {"Test transaction confirmed!"}
          </h1>
          <p className="font-semibold text-gray-950 min-w-min w-[500px] mr-8">
            {
              "Your test transaction has been confirmed, you may now send the full transaction to your verified contact. Once the transaction is sent, you can add them to your address book to easily send payments in the future"
            }
          </p>
          <Separator.Root className="bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]" />
          <h1 className="text-xl font-bold mb-2">
            {"Add recepient to address book"}
          </h1>
          <input
            className="bg-blackA2 shadow-blackA6 inline-flex h-[35px] w-[520px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black dark:text-white shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-black"
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
          <button
            className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={handleSaveAddress}
          >
            {showConfirmation
              ? "Contact added"
              : "Add recipient to address book"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AddressBook;
