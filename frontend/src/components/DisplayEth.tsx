import { Flex, Icon, Text, TextProps } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

export type DisplayEthProps = TextProps & {
	value?: BigNumber
	decimals?: number
	iconSize?: number
}

export const DisplayEth: React.FC<DisplayEthProps> = ({ value, decimals = 4, iconSize = 4, ...textProps }) => {
	if (value === undefined || value === null) {
		return null
	}

	const parts = formatEther(value).split('.')
	const displayValue = parts[0] + '.' + parts[1].slice(0, decimals)

	return (
		<Flex alignItems='center'>
			<Icon as={FaEthereum} color='gray.500' w={iconSize} h={iconSize} />
			<Text as='span' fontSize='lg' fontWeight='bold' {...textProps}>
				{displayValue}
			</Text>
		</Flex>
	)
}
