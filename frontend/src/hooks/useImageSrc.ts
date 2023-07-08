import { useEffect, useState } from 'react'
import { useContractAddress } from './useContractAddress'
import { randomizeArray } from '@utils'

const IMAGE_COUNT = 64
const ref = {
	randomNumbers: [] as number[],
}

export const useImageSrc = (id: number) => {
	const [imageNumber, setImageNumber] = useState<number>()
	const address = useContractAddress()
	const index = (id - 1) % (IMAGE_COUNT + 1)

	useEffect(() => {
		if (address && !ref.randomNumbers?.length) {
			const seed = parseInt(address, 16)
			const numbers = Array.from({ length: IMAGE_COUNT }, (_, i) => i)
			ref.randomNumbers = randomizeArray(seed, numbers)
		}
		setImageNumber(ref.randomNumbers[index])
	}, [address, imageNumber, index])

	return imageNumber ? `/images/concept/concept${imageNumber}.jpeg` : '/images/1024x1024.png'
}
