import * as PushAPI from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import * as ethers from "ethers";

const Pkey = `0x${process.env.NEXT_PUBLIC_PK}`;
const signer = new ethers.Wallet(Pkey);
const channelAddress = "0xBC3F74CECF1fA8270A6FAE935e974a5a9570D054";
const environment = ENV.STAGING;
const environmentInteger = "5";

const formatDate = (date: any) => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  } else if (day === 2 || day === 22) {
    suffix = "nd";
  } else if (day === 3 || day === 23) {
    suffix = "rd";
  }

  return `${day}${suffix} ${monthNames[monthIndex]} ${year}`;
};

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

export const sendPaymentNotification = async (
  sender: string | undefined,
  data: TransactionData,
  etherscanLink: string
) => {
  try {
    const now = new Date();
    const date = formatDate(now);
    const time = now.toISOString().split("T")[1].split(".")[0];

    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `Payment Sent`,
        body: `${etherscanLink}`,
      },
      payload: {
        title: `Payment Sent`,
        body: `${date} ${time} (UTC): You paid ${data.amount} ${
          data.token
        } to ${data.recipient?.slice(0, 4)}...${data.recipient?.slice(-4)}`,
        cta: `${etherscanLink}`,
        img: "",
      },
      recipients: `eip155:${environmentInteger}:${sender}`, // recipient address
      channel: `eip155:${environmentInteger}:${channelAddress}`,
      env: environment,
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse: ", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};

export const sendTestPaymentNotification = async (
  sender: string | undefined,
  data: TransactionData | undefined,
  etherscanLink: string
) => {
  try {
    const now = new Date();
    const date = formatDate(now);
    const time = now.toISOString().split("T")[1].split(".")[0];

    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `Test Payment Sent`,
        body: `${etherscanLink}`,
      },
      payload: {
        title: `Test Payment Sent`,
        body: `${date} ${time} (UTC): You received a test payment of 0.00169 gETH from ${sender}`,
        cta: `${etherscanLink}`,
        img: "",
      },
      recipients: `eip155:${environmentInteger}:${data?.recipient}`, // recipient address
      channel: `eip155:${environmentInteger}:${channelAddress}`,
      env: environment,
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse: ", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};

// export const sendNotificationRequest = async (
//   sender: string | undefined,
//   networkName: string | undefined,
//   amount: string,
//   description: string,
//   tokenName: string | undefined,
//   woopId: any
// ) => {
//   try {
//     const now = new Date();
//     const date = formatDate(now);
//     const time = now.toISOString().split("T")[1].split(".")[0];

//     const apiResponse = await PushAPI.payloads.sendNotification({
//       signer,
//       type: 3, // target
//       identityType: 2, // direct payload
//       notification: {
//         title: `Woop Payment Requested`,
//         body: `${woopId}`,
//       },
//       payload: {
//         title: `Woop Payment Requested`,
//         body: `${date} ${time} (UTC): ${sender?.slice(0, 4)}...${sender?.slice(
//           -4
//         )} requested ${amount} ${tokenName} on network ${networkName} for ${description}`,
//         cta: "",
//         img: "",
//       },
//       recipients: `eip155:${environmentInteger}:${sender}`, // recipient address
//       channel: `eip155:${environmentInteger}:${channelAddress}`,
//       env: environment,
//     });

//     // apiResponse?.status === 204, if sent successfully!
//     console.log("API repsonse: ", apiResponse);
//   } catch (err) {
//     console.error("Error: ", err);
//   }
// };

export const optIn = (address: any, signer: any) => {
  return new Promise((resolve, reject) => {
    PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: `eip155:${environmentInteger}:${channelAddress}`,
      userAddress: `eip155:${environmentInteger}:${address}`,
      onSuccess: () => {
        console.log("opt in success");
        resolve(true);
      },
      onError: (error) => {
        console.error(error);
        resolve(false);
      },
      env: environment,
    });
  });
};

export const optOut = async (address: any, signer: any) => {
  await PushAPI.channels.unsubscribe({
    signer: signer,
    channelAddress: `eip155:${environmentInteger}:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log("opt out success");
      return true;
    },
    onError: () => {
      console.error("opt out error");
      return false;
    },
    env: environment,
  });
};

export const retrieveNotifications = async (address: string | undefined) => {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    env: environment,
  });

  return notifications;
};

export const retrieveSubscriptions = async (address: string | undefined) => {
  const subscriptions = await PushAPI.user.getSubscriptions({
    user: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    env: environment,
  });

  return subscriptions.some(
    (subscription: any) => subscription["channel"] == channelAddress
  );
};
