import { ContractName, DeployNetwork, deployContract } from '../deploy-contract';

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Mumbai,
  budget: 0.006,
  testRun: false
});
