import { ethers } from 'hardhat';
import { deploymentBudgetCheck } from './deployment-budget-check';
import { frontendAddressUpdate } from './frontend-address-update';

const TESTRUN = process.env.TESTRUN === 'true'

export enum ContractName {
  Fairground = 'Fairground',
}

export enum DeployNetwork {
  Localhost = 'localhost',
  Goerli = 'goerli',
  Mumbai = 'mumbai',
  Polygon = 'polygon',
  Sepolia = 'sepolia',
  Mainnet = 'mainnet',
}

export enum TokenSymbol {
  ETH = 'ETH',
  MATIC = 'MATIC',
  MUMATIC = 'muMATIC',
  GOETH = 'goETH',
  SETH = 'SETH',
}

export const networkSymbol = {
  [DeployNetwork.Localhost]: TokenSymbol.ETH,
  [DeployNetwork.Goerli]: TokenSymbol.GOETH,
  [DeployNetwork.Mumbai]: TokenSymbol.MUMATIC,
  [DeployNetwork.Polygon]: TokenSymbol.MATIC,
  [DeployNetwork.Sepolia]: TokenSymbol.SETH,
  [DeployNetwork.Mainnet]: TokenSymbol.ETH,
}

export type DeployContractOptions = {
  name: ContractName;
  network: DeployNetwork;
  budget: number;
  customCode?: (contract: any) => Promise<void>;
  testRun?: boolean;
}

const testRunContract = {
  address: '0x-TEST-RUN-000000000',
  deployed: () => undefined
}

export async function deployContract(options: DeployContractOptions) {
  async function main() {
    const {name, network, budget, customCode, testRun: hardcodedTestRun } = options;
    const testRun = TESTRUN || hardcodedTestRun;
    const symbol = networkSymbol[network];

    if (testRun) {
      console.log('---- TEST RUN ----')
    }

    const contractFactory = await ethers.getContractFactory(name);

    await deploymentBudgetCheck(contractFactory, budget, symbol, testRun);

    const Contract = testRun ? testRunContract : await contractFactory.deploy();

    if (!testRun) {
      await Contract.deployed();

      if (customCode) {
        await customCode(Contract)
      }
    }

    console.log(`${name} deployed to: ${Contract.address}`);

    frontendAddressUpdate(network, Contract.address, testRun);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
