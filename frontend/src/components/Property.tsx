import { Box, Text, Flex, Stack, useBoolean, SlideFade, Fade, Icon, Tooltip, Img } from '@chakra-ui/react'
import { Fairground } from 'typechain'
import React from 'react'
import { DisplayEth } from './DisplayEth'
import { Bid } from '@components/contract/Bid'
import { StatusBadge } from './StatusBadge'
import { css } from '@emotion/react'
import { HiBadgeCheck } from 'react-icons/hi'
import { PropertyId } from './PropertyId'
import { Claim } from '@components/contract/Claim'
import { useAccount } from 'wagmi'
import { isExpired } from '@utils'
import { useRandomImage } from '@hooks'

export type FairgroundProperty = Awaited<ReturnType<Fairground['propertyList']>>[0]

export type PropertyProps = {
	property: FairgroundProperty
}

export const propertyHoverZoom = css`
	img {
		transition: transform 0.5s ease-in-out;
		transform-origin: center center;
	}

	&:hover img {
		transform: scale(1.1);
	}
`

export const Property: React.FC<PropertyProps> = ({ property }) => {
	const [hovered, setHovered] = useBoolean()
	const account = useAccount()
	const { id, currentBid, auctionEnd, leaseEnd, owner, recordedOwner } = property
	const isOwner = account.address === owner
	const actionText = isOwner ? 'Set Reserve' : 'Place Bid'
	const imgSrc = useRandomImage(Number(id))
	const expired = isExpired(auctionEnd) && isExpired(leaseEnd)

	return (
		<Bid owner={owner} propId={id}>
			<Box css={propertyHoverZoom} cursor='pointer' boxShadow='md' borderRadius='lg' overflow='hidden' onMouseEnter={setHovered.on} onMouseLeave={setHovered.off}>
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
					<Fade in={!hovered}>
						<Box position='absolute'>
							<StatusBadge property={property} />
						</Box>
					</Fade>
				</Box>
				<SlideFade in={hovered} style={{ zIndex: 10 }}>
					<Box p={1} color='white' bg='orange.500'>
						<Text textAlign='center' fontSize='sm'>
							{actionText}
						</Text>
					</Box>
				</SlideFade>
			</Box>
		</Bid>
	)
}
