import { BigNumber } from 'ethers'
import { useCallback, useState } from 'react'
import { useContract } from '@hooks'
import { Fairground } from 'typechain'

export type Property = Awaited<ReturnType<Fairground['propertyDetail']>>

export type UsePropertyDetailResult = {
	refresh: () => Promise<void>
	details: Property | undefined
	loading: boolean
}

export const usePropertyDetail = (propId: BigNumber): UsePropertyDetailResult => {
	const { callContract, loading } = useContract()
	const [details, setData] = useState<Property>()

	const refresh = useCallback(
		() =>
			callContract({
				callback: async (contract) => {
					setData(await contract.propertyDetail(propId))
				},
			}),
		[callContract, propId],
	)

	return {
		refresh,
		details,
		loading,
	}
}
