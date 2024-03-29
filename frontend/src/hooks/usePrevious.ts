import { useEffect, useRef } from 'react'

export const usePrevious = (value: unknown): unknown => {
	const ref = useRef(value)
	useEffect(() => {
		ref.current = value
	}, [value])
	return ref.current
}
