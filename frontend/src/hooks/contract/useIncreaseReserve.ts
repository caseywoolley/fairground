import { useContract, usePageRefresh } from '@hooks'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

export type UseIncreaseReserveResult = {
	loading: boolean
	increaseReserve: (propId: BigNumber, bidAmount: BigNumber) => Promise<void>
}

export const useIncreaseReserve = (): UseIncreaseReserveResult => {
	const pageRefresh = usePageRefresh()
	const { callContractWithSigner, loading } = useContract()

	const increaseReserve = useCallback(
		(propId: BigNumber, bidAmount: BigNumber) =>
			callContractWithSigner({
				callback: async (contract) => {
					const value = await contract.targetBid(propId, bidAmount)
					const reciept = await contract.increaseReserve(propId, { value })
					await reciept.wait()
				},
				onSuccess: () => {
					pageRefresh()
				},
				successMessage: 'Reserve set',
				errorMessage: 'Error setting reserve',
			}),
		[callContractWithSigner, pageRefresh],
	)

	return {
		loading,
		increaseReserve,
	}
}
