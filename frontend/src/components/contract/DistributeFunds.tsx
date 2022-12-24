import { Button } from '@chakra-ui/react'
import { useDistributeFunds, useIsAdmin } from '@hooks'
import React from 'react'

export const DistributeFunds: React.FC = () => {
	const isAdmin = useIsAdmin()
	const { loading, distribute } = useDistributeFunds()

	if (!isAdmin) {
		return null
	}

	return (
		<Button colorScheme='orange' isLoading={loading} onClick={distribute}>
			Distribute Community Funds
		</Button>
	)
}
