import { ContractName, DeployNetwork, deployContract } from '../deploy-contract';

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Sepolia,
  budget: 0.005,
  testRun: false
});
