import { ContractName, DeployNetwork, deployContract, TokenSymbol } from '../deploy-contract';

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Polygon,
  budget: 0.000005,
  testRun: true
});
