import { BigNumberish } from 'ethers'

export type DateTime = Date | number | string | BigNumberish

export function getTimestamp(time: DateTime, offset?: number): number {
	return new Date(Number(time) * 1000).getTime() + (offset ?? 0)
}

export function getHumanReadableDate(timestamp: number): string {
	return new Date(timestamp).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function isExpired(time: DateTime): boolean {
	return getTimestamp(time) < Date.now()
}
