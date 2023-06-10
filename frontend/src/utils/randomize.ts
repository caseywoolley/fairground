export function addressToNumber(address: string): number {
	let seed = 0
	for (let i = 0; i < address.length; i++) {
		seed = seed * 16 + parseInt(address[i], 16)
	}
	return seed
}

export function randomizeArray(seed: number, array: number[]) {
	const rng = new RNG(seed)
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = rng.nextRange(0, i + 1)
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

export class RNG {
	m: number
	a: number
	c: number
	state: number

	constructor(seed?: number) {
		this.m = 0x80000000
		this.a = 1103515245
		this.c = 12345
		this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1))
	}

	nextInt(): number {
		this.state = (this.a * this.state + this.c) % this.m
		return this.state
	}

	nextFloat(): number {
		return this.nextInt() / (this.m - 1)
	}

	nextRange(start: number, end: number): number {
		const rangeSize = end - start
		const randomUnder1 = this.nextInt() / this.m
		return start + Math.floor(randomUnder1 * rangeSize)
	}

	choice<T>(array: T[]): T {
		return array[this.nextRange(0, array.length)]
	}
}
