import React from "react";
import { useAccount } from "wagmi";
import { retrieveNotifications } from "../utils/push";
import Link from "next/link";

const Notifications: React.FC<{
  goBack: () => void;
}> = ({ goBack }) => {
  const [notifications, setNotifications] = React.useState<any>([]);
  const { address } = useAccount();

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    console.log("Notifications => ", data);
    setNotifications(data);
  };

  React.useEffect(() => {
    if (address) {
      retrieveData();
    }
  }, [address]);

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
          <h1 className="text-3xl font-bold mb-2">{"Your Transactions"}</h1>
          <br />
          {notifications
            .filter(
              (notification: any) => notification?.title === "Payment Sent"
            )
            .map((notification: any, index: any) => (
              <>
                <h1 className="text-lg font-bold mb-2">
                  {"✅"}
                  {notification?.message}
                </h1>
                <Link
                  href={notification?.cta}
                  key={index}
                  className="text-base mb-2"
                >
                  {"Check Etherscan"}
                </Link>
              </>
            ))}
          {/* <h1 className="text-xl font-bold mb-2">{"you paid 1 ETH"}</h1>
          <h1 className="text-xl font-bold mb-2">
            {"alerex.eth sent you a test transaction!"}
          </h1>
          <br /> */}
          {/* <button
            className="text-lg font-semibold rounded-md border-2 min-w-min border-sky-500 p-2 bg-gray-00 w-full text-sky-500"
            type="button"
            onClick={handleSaveAddress}
          >
            {"Check transaction"}
          </button> */}
        </div>
      </div>
    </main>
  );
};

export default Notifications;
