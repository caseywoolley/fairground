import { Box, Flex, Stack, Icon, Tooltip, Image, Skeleton, AspectRatio } from '@chakra-ui/react'
import { DisplayCurrency } from './DisplayCurrency'
import { StatusBadge } from './StatusBadge'
import { HiBadgeCheck } from 'react-icons/hi'
import { PropertyId } from './PropertyId'
import { Claim } from '@components/contract/Claim'
import { BigNumber } from 'ethers'
import { useRandomImage, useOnMount, usePropertyDetail } from '@hooks'
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

	const { id, currentBid, auctionEnd, leaseEnd, owner, recordedOwner } = property.details ?? {}
	const imgSrc = useRandomImage(Number(id))
	const isOwner = account.address === owner
	const expired = isExpired(auctionEnd ?? 0) && isExpired(leaseEnd ?? 0)

	if (!property?.details) {
		return <Skeleton height={464} />
	}

	return (
		<Box>
			<Box overflow='hidden'>
				<AspectRatio ratio={1}>
					<Image objectFit='cover' src={imgSrc} alt='Property Thumbnail' />
				</AspectRatio>
			</Box>
			<Box m={2}>
				<Flex justifyContent='space-between' alignItems='center'>
					<Stack direction='row' alignItems='center'>
						<PropertyId number={id ?? 0} />
						{isOwner && (
							<Tooltip hasArrow label='You own this' shouldWrapChildren placement='top'>
								<Icon as={HiBadgeCheck} color='orange.400' />
							</Tooltip>
						)}
						<Claim
							owner={owner as string}
							recordedOwner={recordedOwner as string}
							propId={id as BigNumber}
							currentBid={currentBid as BigNumber}
							isExpired={expired}></Claim>
					</Stack>
					<DisplayCurrency value={currentBid} />
				</Flex>
				<StatusBadge property={property.details} />
			</Box>
		</Box>
	)
}
