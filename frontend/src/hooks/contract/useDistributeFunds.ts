import { useCallback } from 'react'
import { useContract, useTotalSupply } from '@hooks'

export type UseDistributeFundsResult = {
	loading: boolean
	distribute: () => Promise<void>
}

export const useDistributeFunds = (): UseDistributeFundsResult => {
	const total = useTotalSupply()
	const { callContractWithSigner, loading } = useContract()

	const distribute = useCallback(
		() =>
			callContractWithSigner({
				callback: async (contract) => {
					const transaction = await contract.distributeFunds()
					await transaction.wait()
				},
				successMessage: `Funds distributed successfully`,
				errorMessage: `Funds distribution failed`,
				onSuccess: () => {
					total.refresh()
				},
			}),
		[callContractWithSigner, total],
	)

	return {
		loading,
		distribute,
	}
}
