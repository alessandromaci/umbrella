import React from "react";
import { Database } from "@tableland/sdk";
import { useAccount } from "wagmi";
// import { getRequestBody } from "../utils/polygonId";

interface UserProfile {
  userName: string;
  country: string;
}

interface Schema {
  id: number;
  userName: string;
  country: string;
}

const db = new Database<Schema>();

const UserProfileForm: React.FC<{
  onSave: (profile: UserProfile) => void;
}> = ({ onSave }) => {
  const [userName, setUserName] = React.useState<string>("");
  const [country, setCountry] = React.useState<string>("");
  const { address } = useAccount();

  const name: string = "profile_table_80001_7709";

  const handleSave = async () => {
    if (process.env.NEXT_PUBLIC_CREATE_TABLE == "true") {
      const prefix: string = "profile_table";
      const { meta: create } = await db
        .prepare(
          `CREATE TABLE ${prefix} (a_address text primary key, b_userName text, c_country text);`
        )
        .run();

      console.log(create.txn?.name);

      const { meta: insert } = await db
        .prepare(
          `INSERT INTO ${create.txn?.name} (a_address, b_userName, c_country) VALUES (?, ?, ?);`
        )
        .bind(address, userName, country)
        .run();

      // Wait for transaction finality
      await insert.txn?.wait();

      // Perform a read query, requesting all rows from the table
      const { results } = await db
        .prepare(`SELECT * FROM ${create.txn?.name};`)
        .all();
      console.log(`results`, results);
    } else {
      const { meta: insert } = await db
        .prepare(
          `UPDATE ${name} SET b_userName = ?, c_country = ? WHERE a_address = ?`
        )
        .bind(userName, country, address)
        .run();

      // Wait for transaction finality
      await insert.txn?.wait();

      // Perform a read query, requesting all rows from the table
      const { results } = await db.prepare(`SELECT * FROM ${name};`).all();
      console.log(`results`, results);
    }

    if (userName && country) {
      onSave({ userName, country });
      console.log(userName, country);
    } else {
      alert("Please fill all fields.");
    }
  };

  // const handleRequest = async () => {
  //   const request = await getRequestBody();
  //   console.log(request);
  // };

  return (
    <div>
      <div>
        <label>
          User Name:
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Country:
          <input value={country} onChange={(e) => setCountry(e.target.value)} />
        </label>
      </div>
      <button onClick={handleSave}>Save</button>
      {/* <button onClick={handleRequest}>Request Verification</button> */}
    </div>
  );
};

export default UserProfileForm;
