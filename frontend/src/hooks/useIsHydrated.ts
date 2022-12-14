import { useBoolean } from '@chakra-ui/react'
import { useOnMount } from './useOnMount'

// Workaround for nextjs hydration issue - https://github.com/vercel/next.js/discussions/35773
export const useIsHydrated = () => {
	const [isHydrated, setIsHydrated] = useBoolean(false)

	useOnMount(setIsHydrated.on)

	return isHydrated
}
