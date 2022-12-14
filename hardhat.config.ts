import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';
import {config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: `${__dirname}/.env.local` });

const GOERLI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY || ''
const MAINNET_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY || ''
const MUMBAI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY || ''
const TESTNET_SIGNER = process.env.TESTNET_SIGNER || ''

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    artifacts: './frontend/artifacts'
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 1000
      }
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [TESTNET_SIGNER]
    },
    mainnet: {
      chainId: 1,
      url: `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_API_KEY}`,
      accounts: [TESTNET_SIGNER]
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_API_KEY}`,
      accounts: [TESTNET_SIGNER]
    }
  },
  typechain: {
    outDir: './frontend/typechain',
  },
};

export default config;
