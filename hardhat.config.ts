import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';
import {config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: `${__dirname}/frontend/.env.local` });

const SEPOLIA_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API_KEY || ''
const GOERLI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY || ''
const MAINNET_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY || ''
const MUMBAI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY || ''
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY || ''
const TESTNET_WALLET = process.env.TESTNET_WALLET || ''
const MAINNET_WALLET = process.env.MAINNET_WALLET || ''

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    artifacts: './frontend/artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        accountsBalance: '1000000000000000000000000'
      },
      mining: {
        auto: true,
        interval: 1000
      }
    },
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}`,
      accounts: [TESTNET_WALLET]
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [TESTNET_WALLET]
    },
    mainnet: {
      chainId: 1,
      url: `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_API_KEY}`,
      accounts: [MAINNET_WALLET]
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_API_KEY}`,
      accounts: [TESTNET_WALLET]
    },
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_API_KEY}`,
      accounts: [MAINNET_WALLET]
    }
  },
  typechain: {
    outDir: './frontend/typechain',
  },
};

export default config;
