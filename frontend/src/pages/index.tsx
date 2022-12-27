import { Divider, Flex, Icon, IconButton, SimpleGrid, Text, useBoolean } from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { Layout } from '@components/layout'
import { DisplayEth, Pagination } from '@components'
import { useCommunityFunds, usePropertyList, usePageRefresh, useStore, useTotalSupply, useIsHydrated, useOnUnmount } from '@hooks'
import { Mint } from '@components/contract'
import { Property } from '@components'
import { MdRefresh } from 'react-icons/md'
import { useAccount } from 'wagmi'
import { Fairground } from 'typechain/Fairground'

const Home: React.FC = () => {
	const isHydrated = useIsHydrated()
	const { isConnected } = useAccount()
	const [active, setActive] = useBoolean(false)
	const [refreshing, setRefreshing] = useBoolean(false)
	const pageRefresh = usePageRefresh()
	const community = useCommunityFunds()
	const properties = usePropertyList()
	const totalSupply = useTotalSupply()
	const { pagination } = useStore((store) => store)

	useOnUnmount(() => setActive.off)

	useEffect(() => {
		if (isConnected && !active) {
			setActive.on()
			pageRefresh()
		}

		if (!isConnected && active) {
			setActive.off()
		}
	}, [isConnected, active, properties.list, pageRefresh, setActive, setActive.off, setActive.on])

	const handleRefresh = useCallback(() => {
		pageRefresh()
		setRefreshing.on()

		setTimeout(() => {
			setRefreshing.off()
		}, 400)
	}, [pageRefresh, setRefreshing])

	// useEffect(() => {
	//     const intervalId = setInterval(pageRefresh, 60 * 1000);
	//     return () => clearInterval(intervalId);
	// }, [pageRefresh]);

	if (!isHydrated) {
		return null
	}

	const pageMax = Math.ceil(Number(totalSupply.count ?? 1) / pagination.count ?? 1)
	const rangeStart = (pagination.page - 1) * pagination.count + 1
	const rangeEnd = Math.min(rangeStart + pagination.count - 1, Number(totalSupply.count))
	const propertyRange = `${rangeStart} - ${rangeEnd} of ${Number(totalSupply.count)}`

	return (
		<Layout>
			<Divider pt={8}></Divider>
			<Flex justifyContent='space-between' width='100%' mt='8' mb='4'>
				<Flex gridGap={2} alignItems='center'>
					<Mint />
					<IconButton isLoading={refreshing} onClick={handleRefresh} aria-label='refresh' icon={<Icon as={MdRefresh} w={6} h={6} />} />
					{Boolean(totalSupply.count) && (
						<Text pl={5} color='gray.500'>
							{propertyRange}
						</Text>
					)}
				</Flex>
				<Flex gridGap={2} alignItems='center'>
					<Text fontSize='lg'>Community Funds</Text>
					<DisplayEth value={community.funds} />
				</Flex>
				<Pagination max={pageMax} />
			</Flex>
			<SimpleGrid mt={2} gridGap={2} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
				{properties.list.map((property: Fairground.PropertyDetailsStructOutput) => (
					<Property key={Number(property.id)} property={property} />
				))}
			</SimpleGrid>
		</Layout>
	)
}

export default Home
