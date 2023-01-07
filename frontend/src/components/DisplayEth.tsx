import { Flex, Icon, Text, TextProps } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { commify, formatUnits } from 'ethers/lib/utils'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

export type DisplayEthProps = TextProps & {
	value?: BigNumber
	precision?: number
	iconSize?: number
}

const getUnit = (num: BigNumber, precision: number) => {
	const value = Number(num)

	switch (true) {
		case value > Math.pow(10, 18 - precision):
			return 'eth'
		case value > Math.pow(10, 9 - precision):
			return 'gwei'
		case value > 0:
			return 'wei'
		default:
			return 'eth'
	}
}

export const DisplayEth: React.FC<DisplayEthProps> = ({ value, precision = 3, iconSize = 4, ...textProps }) => {
	if (value === undefined || value === null) {
		return null
	}
	const unit = getUnit(value, precision)
	const [wholeValue, fractionalValue] = formatUnits(value, unit === 'eth' ? 'ether' : unit).split('.')
	const displayFractional = Number(fractionalValue) > 0 ? `.${fractionalValue?.slice(0, precision)}` : ''
	const displayValue = commify(`${wholeValue}${displayFractional}`)

	return (
		<Flex alignItems='center'>
			<Icon as={FaEthereum} color='gray.400' w={iconSize} h={iconSize} />
			<Text as='span' fontSize='lg' fontWeight='bold' {...textProps}>
				{`${displayValue} ${unit.toUpperCase()}`}
			</Text>
		</Flex>
	)
}
