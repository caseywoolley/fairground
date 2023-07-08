import * as contractAddresses from 'artifacts/contracts/contractAddresses'
import { useNetwork, chain as chains } from 'wagmi'

export const useContractAddress = () => {
	const { chain } = useNetwork()

	switch (chain?.id) {
		case chains.localhost.id:
			return contractAddresses.localhost
		case chains.goerli.id:
			return contractAddresses.goerli
		case chains.polygonMumbai.id:
			return contractAddresses.mumbai
		case chains.sepolia.id:
			return contractAddresses.sepolia
		default:
			return contractAddresses.localhost
	}
}
