import { Divider, Flex, Icon, IconButton, SimpleGrid, Text, useBoolean } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef } from 'react'
import { Layout } from '@components/layout'
import { DisplayEth, Pagination, PropertyDemo } from '@components'
import { useCommunityFunds, usePropertyList, usePageRefresh, useStore, useTotalSupply, useIsHydrated } from '@hooks'
import { Mint } from '@components/contract'
import { Property } from '@components'
import { MdRefresh } from 'react-icons/md'
import { useAccount, useNetwork } from 'wagmi'

const Home: React.FC = () => {
	const isHydrated = useIsHydrated()
	const { isConnected } = useAccount()
	const { chain } = useNetwork()
	const network = useRef(chain?.network)

	const pageRefresh = usePageRefresh()
	const [refreshing, setRefreshing] = useBoolean(false)
	const { pagination } = useStore((store) => store)

	const community = useCommunityFunds()
	const properties = usePropertyList()
	const totalSupply = useTotalSupply()

	const demoPropertyIds = [...Array(10).keys()].map((id) => ({ id: id + 1 })).reverse()

	useEffect(() => {
		if (network.current !== chain?.network) {
			network.current = chain?.network
			pageRefresh()
		}
	}, [chain?.network, pageRefresh])

	const handleRefresh = useCallback(() => {
		pageRefresh()
		setRefreshing.on()

		setTimeout(() => {
			setRefreshing.off()
		}, 400)
	}, [pageRefresh, setRefreshing])

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
			{isConnected && (
				<>
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
							{Boolean(community.funds) && <Text fontSize='lg'>Community Funds</Text>}
							<DisplayEth value={community.funds} />
						</Flex>
						<Pagination max={pageMax} />
					</Flex>
				</>
			)}
			<SimpleGrid mt={2} gridGap={2} templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
				{isConnected && properties.list.map((property) => <Property key={Number(property.id)} property={property} />)}
				{!isConnected && demoPropertyIds.map((property) => <PropertyDemo key={Number(property.id)} property={property} />)}
			</SimpleGrid>
		</Layout>
	)
}

export default Home
