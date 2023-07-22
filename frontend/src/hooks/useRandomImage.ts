import { useMemo } from 'react'
import { useContractAddress } from './useContractAddress'
import { randomizeArray } from '@utils'

const IMAGE_COUNT = 63
const DEFAULT_SEED = 9
const numberArray = Array.from({ length: IMAGE_COUNT }, (_, i) => i)
const defaultArray = randomizeArray(DEFAULT_SEED, numberArray)

function wrapNumberInRange(number: number, min: number, max: number) {
	return ((number - min) % (max - min)) + min
}

export const useRandomImage = (id: number) => {
	const address = useContractAddress()

	const randomArray = useMemo(() => {
		if (!address) {
			return defaultArray
		}

		const seed = parseInt(address, 16)

		return randomizeArray(seed, defaultArray)
	}, [address])

	const url = useMemo(() => {
		if (!Number.isInteger(id)) {
			return
		}

		const index = wrapNumberInRange(id - 1, 0, IMAGE_COUNT)
		const imgId = randomArray[index]

		return `/images/concept/concept${imgId}.jpeg`
	}, [id, randomArray])

	return url ?? '/images/1024x1024.png'
}
