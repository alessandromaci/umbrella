import "dotenv/config";
import { HardhatUserConfig } from "hardhat/types";

import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";

import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    mumbai: {
      url: process.env.INFURA_GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    goerli: {
      url: process.env.INFURA_GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
    scroll_sepolia: {
      url: process.env.SCROLL_SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
  },

  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_PRIVATE_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_PRIVATE_KEY || "",
      scroll_sepolia: process.env.SCROLLSCAN_PRIVATE_KEY || "",
    },
    customChains: [
      {
        network: "scroll_sepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.dev/api",
          browserURL: "https://sepolia.scrollscan.dev/",
        },
      },
    ],
  },
};

export default config;
