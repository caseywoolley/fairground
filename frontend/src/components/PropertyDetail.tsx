import { Box, Flex, Stack, Icon, Tooltip, Img, Skeleton } from '@chakra-ui/react'
import { DisplayEth } from './DisplayEth'
import { StatusBadge } from './StatusBadge'
import { HiBadgeCheck } from 'react-icons/hi'
import { PropertyId } from './PropertyId'
import { Claim } from '@components/contract/Claim'
import { BigNumber } from 'ethers'
import { useOnMount, usePropertyDetail } from '@hooks'
import { useAccount } from 'wagmi'
import { isExpired } from '@utils'

export type PropertyDetailProps = {
	propId: BigNumber
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({ propId }) => {
	const account = useAccount()
	const property = usePropertyDetail(propId)

	useOnMount(() => {
		property.refresh()
	})

	if (!property?.details) {
		return <Skeleton height={464} />
	}

	const { id, currentBid, auctionEnd, rentReset, owner, recordedOwner } = property.details ?? {}
	const isOwner = account.address === owner
	const imgSrc = `/images/concept${(Number(id) - 1) % 14}.jpeg`
	const expired = isExpired(auctionEnd) && isExpired(rentReset)

	return (
		<Box>
			<Box overflow='hidden'>
				<Img objectFit='cover' src={imgSrc} alt='Property Thumbnail' />
			</Box>
			<Box m={2}>
				<Flex justifyContent='space-between' alignItems='center'>
					<Stack direction='row' alignItems='center'>
						<PropertyId number={id} />
						{isOwner && (
							<Tooltip hasArrow label='You own this' shouldWrapChildren placement='top'>
								<Icon as={HiBadgeCheck} color='orange.400' />
							</Tooltip>
						)}
						<Claim owner={owner} recordedOwner={recordedOwner} propId={id} currentBid={currentBid} isExpired={expired}></Claim>
					</Stack>
					<DisplayEth value={currentBid} />
				</Flex>
				<StatusBadge isOwner={isOwner} auctionEnd={auctionEnd} rentReset={rentReset} />
			</Box>
		</Box>
	)
}
