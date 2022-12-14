import { useCallback } from 'react'
import { useCommunityFunds, usePropertyList, useTotalSupply } from '@hooks'

export const usePageRefresh = (): (() => void) => {
	const propertyList = usePropertyList()
	const communityFunds = useCommunityFunds()
	const totalSupply = useTotalSupply()

	const pageRefresh = useCallback(() => {
		propertyList.refresh()
		communityFunds.refresh()
		totalSupply.refresh()
	}, [communityFunds, propertyList, totalSupply])

	return pageRefresh
}
