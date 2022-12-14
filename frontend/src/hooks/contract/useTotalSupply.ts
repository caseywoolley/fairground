import { useCallback } from 'react'
import { BigNumber } from 'ethers'
import { useContract, useStore } from '@hooks'

export type UseTotalSupplyResult = {
	refresh: () => Promise<void>
	count: BigNumber
}

export function useTotalSupply(): UseTotalSupplyResult {
	const setTotalSupply = useStore((store) => store.setTotalSupply)
	const totalSupply = useStore((store) => store.totalSupply)
	const { callContract } = useContract()

	const refresh = useCallback(
		() =>
			callContract({
				callback: async (contract) => {
					setTotalSupply(await contract.totalSupply())
				},
			}),
		[callContract, setTotalSupply],
	)

	return {
		refresh,
		count: totalSupply as BigNumber,
	}
}
