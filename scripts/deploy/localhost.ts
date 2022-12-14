import { ethers } from 'hardhat';
import { Fairground } from '../../frontend/typechain';
import { ContractName, DeployNetwork, deployContract, TokenSymbol } from '../deploy-contract';

const customCode = async (contract: Fairground) => {
  const [user1] = await ethers.getSigners();
  for (let i = 0; i < 10; i++) {
      const transaction = await contract.connect(user1).mint(user1.address);
      await transaction.wait();
  }
}

deployContract({
  name: ContractName.Fairground,
  network: DeployNetwork.Localhost,
  budget: 1,
  customCode
});
