import { useEffect, useState } from 'react'
import { useContract } from '@hooks'
import { useAccount } from 'wagmi'

export function useIsAdmin(): boolean {
	const [isAdmin, setIsAdmin] = useState(false)
	const account = useAccount()
	const { callContract } = useContract()

	useEffect(() => {
		callContract({
			callback: async (contract) => {
				const admin = await contract.admin()
				setIsAdmin(admin === account.address)
			},
		})
	}, [account.address, callContract])

	return isAdmin
}
