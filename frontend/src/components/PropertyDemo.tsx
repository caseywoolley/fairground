import { Box, Text, Flex, Stack, useBoolean, SlideFade, Fade, Img } from '@chakra-ui/react'
import React from 'react'
import { PropertyId } from './PropertyId'
import { useRandomImage } from '@hooks'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { propertyHoverZoom } from './Property'

export type PropertyDemoProps = {
	property: { id: number }
}

export const PropertyDemo: React.FC<PropertyDemoProps> = ({ property }) => {
	const [hovered, setHovered] = useBoolean()
	const { id } = property
	const imgSrc = useRandomImage(Number(id))

	const { openConnectModal } = useConnectModal()

	return (
		<div onClick={openConnectModal}>
			<Box css={propertyHoverZoom} cursor='pointer' boxShadow='md' borderRadius='lg' overflow='hidden' onMouseEnter={setHovered.on} onMouseLeave={setHovered.off}>
				<Box overflow='hidden'>
					<Img objectFit='cover' src={imgSrc} alt='Property Thumbnail' />
				</Box>
				<Box m={2}>
					<Fade in={!hovered}>
						<Box position='absolute'></Box>
					</Fade>
				</Box>
				<SlideFade in={hovered} style={{ zIndex: 10 }}>
					<Box p={1} color='white' bg='orange.500'>
						<Text textAlign='center' fontSize='sm'>
							Connect To Place Bids
						</Text>
					</Box>
				</SlideFade>
			</Box>
		</div>
	)
}
