import { BigNumber, BigNumberish } from 'ethers'
import { formatEther, parseEther } from 'ethers/lib/utils'

export function etherValue(value: BigNumberish, decimals?: number): string {
	const eth = formatEther(value)
	return `${Number(eth).toFixed(decimals || 4)}`
}

export const toBigNumber = (value: number): BigNumber => parseEther(String(value))
