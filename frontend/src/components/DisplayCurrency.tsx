import { Flex, Icon, Text, TextProps } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { commify, formatUnits } from 'ethers/lib/utils'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'
import { useNetwork } from 'wagmi'
import { networkMapping } from '@hooks'

export type DisplayCurrencyProps = TextProps & {
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

export const DisplayCurrency: React.FC<DisplayCurrencyProps> = ({ value, precision = 3, iconSize = 4, ...textProps }) => {
	const { chain } = useNetwork()

	if (value === undefined || value === null) {
		return null
	}
	const unit = getUnit(value, precision)
	const isBaseUnit = unit === 'eth'
	const [wholeValue, fractionalValue] = formatUnits(value, isBaseUnit ? 'ether' : unit).split('.')
	const displayFractional = Number(fractionalValue) > 0 ? `.${fractionalValue?.slice(0, precision)}` : ''
	const displayValue = commify(`${wholeValue}${displayFractional}`)

	const currencySymbol = chain?.id ? networkMapping[chain.id]?.symbol ?? FaEthereum : FaEthereum
	const baseUnit = chain?.id ? networkMapping[chain.id].unit ?? 'eth' : 'eth'
	const unitName = isBaseUnit ? baseUnit : unit

	return (
		<Flex alignItems='center'>
			<Icon as={currencySymbol} color='gray.400' w={iconSize} h={iconSize} />
			<Text as='span' fontSize='lg' fontWeight='bold' {...textProps}>
				{`${displayValue} ${unitName.toUpperCase()}`}
			</Text>
		</Flex>
	)
}
