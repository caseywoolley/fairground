import * as contractAddresses from 'artifacts/contracts/contractAddresses'
import { useNetwork, chain as chains } from 'wagmi'
import { useStore } from './useStore'

export const useContractAddress = () => {
	const { chain } = useNetwork()
	const setNetwork = useStore((store) => store.setNetwork)
	const network = useStore((store) => store.network)

	if (network !== chain?.network) {
		console.log(chain?.network)
		setNetwork(chain?.network)
	}

	switch (chain?.id) {
		case chains.localhost.id:
			return contractAddresses.localhost
		case chains.polygonMumbai.id:
			return contractAddresses.mumbai
		case chains.sepolia.id:
			return contractAddresses.sepolia
		default:
			return ''
	}
}
