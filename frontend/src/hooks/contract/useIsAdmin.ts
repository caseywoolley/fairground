import { useState } from 'react'
import { useContract, useOnMount } from '@hooks'
import { useAccount } from 'wagmi'

export function useIsAdmin(): boolean {
	const [isAdmin, setIsAdmin] = useState(false)
	const account = useAccount()
	const { callContract } = useContract()

	useOnMount(() => {
		callContract({
			callback: async (contract) => {
				const admin = await contract.admin()
				setIsAdmin(admin === account.address)
			},
		})
	})

	return isAdmin
}
