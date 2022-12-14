import { Button, useToast } from '@chakra-ui/react'
import { toastDefaults } from '@hooks'
import { providers } from 'ethers'
import { parseEther } from 'ethers/lib/utils.js'
import { useCallback } from 'react'
import { chainId, useAccount } from 'wagmi'
import { useNetwork } from 'wagmi'

const localProvider = new providers.StaticJsonRpcProvider('http://localhost:8545')
const dripAmount = 1000

export const LocalFaucetButton = () => {
	const { address } = useAccount()
	const { chain } = useNetwork()
	const toast = useToast()

	const isLocalChain = chain?.id === chainId.localhost

	const sendFunds = useCallback(async () => {
		if (address) {
			const signer = localProvider.getSigner()
			const transaction = await signer.sendTransaction({
				to: address,
				value: parseEther(String(dripAmount)),
			})

			await transaction.wait()

			toast({
				...toastDefaults,
				status: 'success',
				title: `${dripAmount} ETH sent from local faucet`,
			})
		}
	}, [address, toast])

	if (!isLocalChain) {
		return null
	}

	return (
		<Button colorScheme='orange' onClick={sendFunds}>
			Localhost Faucet
		</Button>
	)
}
