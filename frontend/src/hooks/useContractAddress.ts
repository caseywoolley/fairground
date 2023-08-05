import * as contractAddresses from 'artifacts/contracts/contractAddresses'
import { useNetwork, chain as chains } from 'wagmi'
import { useStore } from './useStore'
import { FaEthereum } from 'react-icons/fa'
import { PolygonMaticLogo } from '@components/PolygonMaticLogo'

const ethNetwork = {
	symbol: FaEthereum,
	unit: 'eth',
}

const polygonNetwork = {
	symbol: PolygonMaticLogo,
	unit: 'matic',
}

export const networkMapping = {
	[chains.localhost.id]: {
		...ethNetwork,
		address: contractAddresses.localhost,
	},
	[chains.sepolia.id]: {
		...ethNetwork,
		address: contractAddresses.sepolia,
	},
	[chains.polygon.id]: {
		...polygonNetwork,
		address: contractAddresses.mumbai,
	},
	[chains.polygonMumbai.id]: {
		...polygonNetwork,
		address: contractAddresses.mumbai,
	},
}

export const useContractAddress = () => {
	const { chain } = useNetwork()
	const setNetwork = useStore((store) => store.setNetwork)
	const network = useStore((store) => store.network)

	if (network !== chain?.network) {
		setNetwork(chain?.network)
	}

	return chain?.id ? networkMapping[chain?.id]?.address ?? '' : ''
}
