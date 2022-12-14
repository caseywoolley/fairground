import { BigNumber } from 'ethers'
import { useCallback } from 'react'
import { useContract, usePageRefresh } from '@hooks'

export type UseUpdateClaimResult = {
	loading: boolean
	updateClaim: (propId: BigNumber) => Promise<void>
}

export const useUpdateClaim = (): UseUpdateClaimResult => {
	const pageRefresh = usePageRefresh()
	const { callContractWithSigner, loading } = useContract()

	const updateClaim = useCallback(
		(propId: BigNumber) =>
			callContractWithSigner({
				callback: async (contract) => {
					const reciept = await contract.updateClaim(propId)
					await reciept.wait()
				},
				onSuccess: () => {
					pageRefresh()
				},
				successMessage: 'Funds received',
			}),
		[callContractWithSigner, pageRefresh],
	)

	return {
		loading,
		updateClaim,
	}
}
