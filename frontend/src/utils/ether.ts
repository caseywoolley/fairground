import { BigNumberish } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

export function etherValue(value: BigNumberish, decimals?: number): string {
	const eth = formatEther(value)
	return `${Number(eth).toFixed(decimals || 4)}`
}
