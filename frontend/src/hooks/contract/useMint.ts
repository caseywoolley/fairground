import { useCallback } from 'react'
import { useContract, usePropertyList, useTotalSupply } from '@hooks'

export type UseMintResult = {
	loading: boolean
	mint: (to: string) => Promise<void>
}

export const useMint = (): UseMintResult => {
	const properties = usePropertyList()
	const total = useTotalSupply()
	const { callContractWithSigner, loading } = useContract()

	const mint = useCallback(
		(to: string) =>
			callContractWithSigner({
				callback: async (contract) => {
					const transaction = await contract.mint(to)
					await transaction.wait()
				},
				successMessage: `New property added`,
				onSuccess: () => {
					properties.refresh()
					total.refresh()
				},
			}),
		[callContractWithSigner, properties, total],
	)

	return {
		loading,
		mint,
	}
}
