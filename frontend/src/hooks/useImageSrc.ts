import { useEffect } from 'react'
import { useContractAddress } from './useContractAddress'
import { randomizeArray } from '@utils'

const length = 64
let randomNumbers: number[] = []

export const useImageSrc = (id: number) => {
	const address = useContractAddress()
	const index = (id - 1) % (length + 1)
	const imageNumber = randomNumbers?.[index]

	useEffect(() => {
		if (!randomNumbers.length) {
			const seed = parseInt(address, 16)
			const numbers = Array.from({ length }, (_, i) => i)
			randomNumbers = randomizeArray(seed, numbers)
		}
	}, [address])

	return `/images/concept/concept${imageNumber}.jpeg`
}
