"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UserProfileForm from "./components/UserProfile";

const Page: React.FC = () => {
  const [showForm, setShowForm] = React.useState<boolean>(false);

  const handleProfileSave = (profile: {
    userName: string;
    country: string;
  }) => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile saved!");
    setShowForm(false); // Close the form after saving
  };

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
    </>
  );
};

export default Page;
