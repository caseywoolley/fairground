import { ContractName, DeployNetwork, deployContract } from '../deploy-contract';

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Goerli,
  budget: 0.00001,
  testRun: true
});
