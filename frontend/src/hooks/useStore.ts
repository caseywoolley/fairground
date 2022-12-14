import { BigNumber } from 'ethers'
import create from 'zustand'
import { PropertyList } from '@hooks'

type PaginationProps = {
	count: number
	page: number
}

type StoreModel = {
	communityFunds: BigNumber | null
	setCommunityFunds: (funds: BigNumber) => void
	pagination: PaginationProps
	setPaginationCount: (count: number) => void
	setPaginationPage: (page: number) => void
	properties: PropertyList
	setProperties: (list: PropertyList) => void
	totalSupply: BigNumber | null
	setTotalSupply: (supply: BigNumber) => void
}

export const useStore = create<StoreModel>((set) => ({
	communityFunds: null,
	setCommunityFunds: (communityFunds) => set(() => ({ communityFunds })),
	pagination: { count: 10, page: 1 },
	setPaginationCount: (count) => set((store) => ({ pagination: { ...store.pagination, count } })),
	setPaginationPage: (page) => set((store) => ({ pagination: { ...store.pagination, page } })),
	properties: [],
	setProperties: (properties) => set(() => ({ properties })),
	totalSupply: null,
	setTotalSupply: (totalSupply) => set(() => ({ totalSupply })),
}))
