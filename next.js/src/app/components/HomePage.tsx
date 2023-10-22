"use client";
import BasicFlow from "../../../public/assets/BasicFlow";
import EnhancedFlow from "../../../public/assets/EnhancedFlow";
import AdvancedFlow from "../../../public/assets/AdvancedFlow";

import DiscordSVG from "../../../public/assets/DiscordSVG";
import GithubSVG from "../../../public/assets/GithubSVG";

export default function HomePage() {
  return (
    <div className="font-noto">
      <section className="w-full p-4 items-center justify-between text-sm flex">
        <div className="w-full p-24 min-w-min">
          <h1 className="text-7xl font-semibold mb-6">
            Welcome to{" "}
            <span className="font-outfit font-bold text-sky-600 text-8xl">
              umbrella
            </span>
          </h1>
          <h3 className="text-4xl font-medium mb-6">
            Your multi-layered security assistant
            <br /> for creating safe web3 payments
          </h3>
          <p className="font-normal text-gray-400 text-lg mb-6">
            Umbrella offers three levels of security with a verified address
            book, providing checks and <br />
            balances that will allow users to confidently send or receive funds
            from accounts in a safe and <br />
            secure way.
          </p>
          <br />
          {/* <button className="text-lg text-white font-semibold rounded-xl p-2 min-w-min text-gray-00 w-[200px] bg-sky-600 mb-12">
            Connect
          </button> */}
        </div>
      </section>
      <section className="w-full items-center justify-between bg-zinc-800 text-sm flex">
        <div className="w-full p-24 min-w-min">
          <h3 className="text-4xl font-medium mb-5">
            Why have we created Umbrella?
          </h3>
          <p className="font-normal text-gray-400 text-lg mb-5">
            Making web3 payments can be a stressful and anxious experience both
            for newcomers to the web3 space,
            <br />
            but also for more experienced users. With irreversible transactions
            it is very difficult, if not impossible, to <br />
            retrieve funds send to the wrong wallet. Adding potentially large
            amounts of funds into the mix and we have
            <br />
            core problem within web3 and its eventual mass adoption.
          </p>
        </div>
      </section>
      <section className="w-full p-4 items-center justify-between text-sm flex">
        <div className="w-full p-24 min-w-min">
          <h3 className="text-4xl font-medium mb-12">
            Multi-layered Security Approach
          </h3>
          <h4 className="text-2xl font-medium mb-5">Basic Security</h4>
          <p className="font-normal text-gray-400 text-lg mb-16">
            Basic payments involve sending a test transaction, through a
            testnet, if a user is sending funds to an address
            <br />
            for the first time. Once the recipient has confirmed they have
            received the transaction, both parties can now
            <br />
            select each other from a verified address book and send safe
            transactions.
          </p>
          <br />
          <BasicFlow />
        </div>
      </section>
      <section className="w-full p-4 items-center justify-between text-sm flex">
        <div className="w-full p-24 min-w-min">
          <h4 className="text-2xl font-medium mb-5">Enhanced Security</h4>
          <p className="font-normal text-gray-400 text-lg mb-16">
            Enhanced security includes the functionality of basic, with the
            added layers of examining a user
            <br />
            on-chain activity to determine if you should be suspicious of this
            wallet address.
          </p>
          <br />
          <EnhancedFlow />
        </div>
      </section>
      <section className="w-full p-4 items-center justify-between text-sm flex">
        <div className="w-full p-24 min-w-min">
          <h4 className="text-2xl font-medium mb-5">Advanced Security</h4>
          <p className="font-normal text-gray-400 text-lg mb-16">
            Advanced security includes the features of the previous two steps,
            with the added bonus of being able to
            <br />
            create an escrow transaction. With this feature, funds will be kept
            in a third party smart contract until such
            <br />
            time as conditions have been met, such as the delivery of certain
            work tasks.
          </p>
          <br />
          <AdvancedFlow />
        </div>
      </section>
      <section className="w-full p-4 items-center justify-between bg-zinc-900 text-sm flex flex-col">
        <div className="w-full p-16 min-w-min flex flex-row gap-8 justify-center">
          <button
            type="button"
            onClick={() =>
              window.open(
                "https://github.com/alessandromaci/umbrella",
                "_blank"
              )
            }
          >
            <DiscordSVG className="hover:fill-white" />
          </button>
          <button
            type="button"
            onClick={() => window.open("https://discord.gg/vHCSnu9s", "_blank")}
          >
            <GithubSVG className="hover:fill-white" />
          </button>
        </div>
        <p className="font-medium">
          Made with ❤️ by<a href=""> Alerex, Julo & Mihir</a>
        </p>
      </section>
    </div>
  );
}
