import { ContractName, DeployNetwork, deployContract, TokenSymbol } from '../deploy-contract';

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Mumbai,
  budget: 0.006,
  testRun: true
});
