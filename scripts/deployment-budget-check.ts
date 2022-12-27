import { ContractFactory } from 'ethers';
import { ethers } from 'hardhat';
import { TokenSymbol } from './deploy-contract';

export async function deploymentBudgetCheck(contract: ContractFactory, budget: number, symbol = TokenSymbol.ETH, testRun?: boolean) {
  const gasPrice = await contract.signer.getGasPrice();
  const deploymentTransaction = contract.getDeployTransaction();
  const estimatedGas = await contract.signer.estimateGas(deploymentTransaction);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await contract.signer.getBalance();
  const deployBudget = ethers.utils.parseEther(String(budget));
  const exceedsFunds = Number(deploymentPrice) - Number(deployerBalance)
  const overBudget = Number(deploymentPrice) - Number(deployBudget)

  console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
  console.log(`Estimated gas: ${estimatedGas}`);
  console.log(`Wallet funds: ${ethers.utils.formatEther(deployerBalance)} ${symbol}`);
  console.log(`Deployment price: ${ethers.utils.formatEther(deploymentPrice)} ${symbol}`);
  console.log(`Deploy budget: ${budget} ${symbol}`);

  if (exceedsFunds > 0) {
    const message = `${exceedsFunds} ${symbol} over wallet balance`;
    if (testRun) {
      console.log(message)
    } else {
      throw new Error(message);
    }
  }

  if (overBudget > 0) {
    const message = `${overBudget} ${symbol} over budget`;
    if (testRun) {
      console.log(message)
    } else {
      throw new Error(message);
    }
  }

  console.log(`${ethers.utils.formatEther(String(Math.abs(overBudget)))} ${symbol} under budget`);
  console.log('---- Budget check completed ----');
}
