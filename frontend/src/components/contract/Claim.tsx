import { Button } from '@chakra-ui/react'
import { useUpdateClaim } from '@hooks'
import { BigNumber } from 'ethers'
import React, { useCallback } from 'react'
import { useAccount } from 'wagmi'

export type ClaimProps = {
	owner: string
	propId: BigNumber
	recordedOwner: string
	currentBid: BigNumber
	isExpired: boolean
}

export const Claim: React.FC<ClaimProps> = ({ currentBid, owner, propId, recordedOwner, isExpired }) => {
	const account = useAccount()
	const { loading, updateClaim } = useUpdateClaim()

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.stopPropagation()
			updateClaim(propId)
		},
		[propId, updateClaim],
	)

	const isOwner = account.address === owner
	const isRecordedOwner = account.address === recordedOwner
	const claimed = owner === recordedOwner
	const isBuyer = isOwner && !isRecordedOwner
	const isSeller = !isOwner && isRecordedOwner
	const is3rdParty = !isOwner && !isRecordedOwner
	const displayButton = isSeller || is3rdParty
	const noFunds = Number(currentBid) === 0

	if (claimed || !isExpired || noFunds || !displayButton) {
		return null
	}

	return (
		<Button size='xs' colorScheme='orange' onClick={handleClick} isLoading={loading}>
			{isBuyer && 'Claim Property'}
			{isSeller && 'Claim Funds'}
			{is3rdParty && 'Activate'}
		</Button>
	)
}
