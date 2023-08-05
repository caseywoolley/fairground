import { ContractName, DeployNetwork, deployContract } from '../deploy-contract';

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Mainnet,
  budget: 0.005,
  testRun: true
});
