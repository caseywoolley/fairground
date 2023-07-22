import { BigNumber } from 'ethers'
import create from 'zustand'
import { PropertyList } from '@hooks'

type PaginationProps = {
	count: number
	page: number
}

type StoreValues = {
	communityFunds: BigNumber | null
	network: string | undefined
	pagination: PaginationProps
	properties: PropertyList
	totalSupply: BigNumber | null
}

type StoreFunctions = {
	setCommunityFunds: (funds: BigNumber) => void
	setNetwork: (network: string | undefined) => void
	setPaginationCount: (count: number) => void
	setPaginationPage: (page: number) => void
	setProperties: (list: PropertyList) => void
	setTotalSupply: (supply: BigNumber) => void
	reset: () => void
}

type StoreModel = StoreValues & StoreFunctions

export const defaultStore: StoreValues = {
	communityFunds: null,
	network: '',
	pagination: { count: 10, page: 1 },
	properties: [],
	totalSupply: null,
}

export const useStore = create<StoreModel>((set) => ({
	...defaultStore,
	setCommunityFunds: (communityFunds) => set({ communityFunds }),
	setNetwork: (network) => set({ network }),
	setPaginationCount: (count) => set((store) => ({ pagination: { ...store.pagination, count } })),
	setPaginationPage: (page) => set((store) => ({ pagination: { ...store.pagination, page } })),
	setProperties: (properties) => set({ properties }),
	setTotalSupply: (totalSupply) => set({ totalSupply }),
	reset: () => set(defaultStore),
}))
