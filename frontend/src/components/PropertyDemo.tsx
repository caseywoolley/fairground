import { Box, Text, useBoolean, SlideFade, Fade, Image, AspectRatio } from '@chakra-ui/react'
import React from 'react'
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
					<AspectRatio ratio={1}>
						<Image objectFit='cover' w='100%' src={imgSrc} fallbackSrc='/images/1024x1024.png' alt='Property Thumbnail' />
					</AspectRatio>
				</Box>
				<Box m={2}>
					<Fade in={!hovered}>
						<Box position='absolute'></Box>
					</Fade>
				</Box>
				<SlideFade in={hovered} style={{ zIndex: 10 }}>
					<Box p={1} color='white' bg='orange.500'>
						<Text textAlign='center' fontSize='sm'>
							Connect Wallet
						</Text>
					</Box>
				</SlideFade>
			</Box>
		</div>
	)
}
