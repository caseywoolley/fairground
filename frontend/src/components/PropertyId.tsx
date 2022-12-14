import { Text, TextProps } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import React from 'react'

export type PropertyIdProps = TextProps & {
	number: number | BigNumber
}

export const PropertyId: React.FC<PropertyIdProps> = ({ number, ...textProps }) => (
	<Text as='span' fontSize='lg' {...textProps}>
		{String(number).padStart(4, '0')}
	</Text>
)
