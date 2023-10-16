"use client";

import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UserProfileForm from "./components/UserProfile";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  usePrepareSendTransaction,
  useSendTransaction,
  useAccount,
  useNetwork,
} from "wagmi";
import { utils } from "ethers";

const Page: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [securityLevel, setSecurityLevel] = useState<string>("Basic Security");

  const handleProfileSave = (profile: {
    userName: string;
    country: string;
  }) => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved!");
    setShowForm(false); // Close the form after saving
  };

  //wagmi native transaction
  const { config: configNative } = usePrepareSendTransaction({
    to: recipient,
    value: amount ? BigInt(utils.parseEther(amount).toString()) : undefined,
  });
  const { data: dataNative, sendTransaction } =
    useSendTransaction(configNative);

  const { isLoading: isLoadingNative, isSuccess: isSuccessNative } =
    useWaitForTransaction({
      hash: dataNative?.hash,
    });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <button onClick={() => setShowForm(!showForm)}>Create Profile</button>
        <ConnectButton />
      </div>

      {showForm && <UserProfileForm onSave={handleProfileSave} />}
      <>
        <div>
          <h2>New Transaction</h2>
          <div>
            <label>
              Enter amount and asset:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <select defaultValue="ETH">
              <option>ETH</option>
              {/* Add other assets as options here */}
            </select>
          </div>
          <div>
            <label>
              Enter recipient:
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
            </label>
          </div>
          <div>
            <label>
              Select security level:
              <select
                value={securityLevel}
                onChange={(e) => setSecurityLevel(e.target.value)}
              >
                <option>Basic Security</option>
                <option>Enhanced Security</option>
                <option>Advanced Security</option>
              </select>
            </label>
          </div>
          <button
            disabled={
              isLoadingNative || !sendTransaction || !recipient || !amount
            }
            type="button"
            onClick={() => sendTransaction?.()}
          >
            {isLoadingNative ? "Sending..." : "Send"}
          </button>
          {isSuccessNative && (
            <div>
              Successfully sent {amount} ether to {recipient}
              <div>
                <a href={`https://etherscan.io/tx/${dataNative?.hash}`}>
                  Etherscan
                </a>
              </div>
            </div>
          )}
        </div>
      </>
    </>
  );
};

export default Page;
