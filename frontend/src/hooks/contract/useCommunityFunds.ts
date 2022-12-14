import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useContract, useStore } from '@hooks'

export type UseCommunityFundsResult = {
	refresh: () => Promise<void>
	funds: BigNumber
}

function useCommunityFunds(): UseCommunityFundsResult {
	const setCommunityFunds = useStore((store) => store.setCommunityFunds)
	const communityFunds = useStore((store) => store.communityFunds)
	const { callContract } = useContract()

	const refresh = useCallback(
		() =>
			callContract({
				callback: async (contract) => {
					setCommunityFunds(await contract.communityFunds())
				},
			}),
		[callContract, setCommunityFunds],
	)

	return {
		refresh,
		funds: communityFunds as BigNumber,
	}
}

export { useCommunityFunds }
