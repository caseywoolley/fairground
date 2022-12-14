import { useContract, usePageRefresh } from '@hooks'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

export type UsePlaceBidResult = {
	loading: boolean
	placeBid: (propId: BigNumber, bidAmount: BigNumber) => Promise<void>
}

export const usePlaceBid = (): UsePlaceBidResult => {
	const pageRefresh = usePageRefresh()
	const { callContractWithSigner, loading } = useContract()

	const placeBid = useCallback(
		(propId: BigNumber, bidAmount: BigNumber) =>
			callContractWithSigner({
				callback: async (contract) => {
					const value = await contract.targetBid(propId, bidAmount)
					const reciept = await contract.placeBid(propId, { value })
					await reciept.wait()
				},
				onSuccess: () => {
					pageRefresh()
				},
				successMessage: 'Bid placed',
				errorMessage: 'Bid failed',
			}),
		[callContractWithSigner, pageRefresh],
	)

	return {
		loading,
		placeBid,
	}
}
