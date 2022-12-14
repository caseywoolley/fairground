import { Fairground } from 'typechain'
import { useCallback } from 'react'
import { useContract, useStore } from '@hooks'

export type PropertyList = Awaited<ReturnType<Fairground['propertyList']>>
export type Pagination = {
	page?: number
	count?: number
}

export type UsePropertyListResult = {
	refresh: (pagination?: Pagination) => Promise<void>
	list: PropertyList
	loading: boolean
}

export function usePropertyList(): UsePropertyListResult {
	const { callContract, loading } = useContract()
	const setProperties = useStore((state) => state.setProperties)
	const properties = useStore((state) => state.properties)
	const storedPage = useStore((store) => store.pagination.page)
	const storedCount = useStore((store) => store.pagination.count)
	const setPage = useStore((store) => store.setPaginationPage)
	const setCount = useStore((store) => store.setPaginationCount)

	const refresh = useCallback(
		(pagination?: Pagination) =>
			callContract({
				callback: async (contract) => {
					const page = pagination?.page ?? storedPage
					const count = pagination?.count ?? storedCount

					const properties = await contract.propertyList(page, count)

					if (page !== storedPage) {
						setPage(page)
					}

					if (count !== storedCount) {
						setCount(count)
					}

					setProperties(properties)
				},
			}),
		[callContract, setCount, setPage, setProperties, storedCount, storedPage],
	)

	return {
		refresh,
		list: properties,
		loading,
	}
}
