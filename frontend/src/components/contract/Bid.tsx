import { Button, FormControl, Input, Tooltip } from '@chakra-ui/react'
import { BasicModal, PropertyDetail } from '@components'
import { useIncreaseReserve, usePlaceBid, usePropertyDetail } from '@hooks'
import { BigNumber, ethers } from 'ethers'
import React, { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'

export type BidProps = {
	children: React.ReactNode
	owner: string
	propId: BigNumber
}

export const Bid: React.FC<BidProps> = ({ children, owner, propId }) => {
	const account = useAccount()
	const [bidAmount, setBidAmount] = useState<BigNumber>()
	const property = usePropertyDetail(propId)
	const { loading: loadingBid, placeBid } = usePlaceBid()
	const { loading: loadingReserve, increaseReserve } = useIncreaseReserve()

	const handleOnClick = useCallback(() => {
		if (bidAmount) {
			account.address === owner ? increaseReserve(propId, bidAmount) : placeBid(propId, bidAmount)
		}
	}, [account, bidAmount, increaseReserve, owner, placeBid, propId])

	const onClose = useCallback(() => {
		setBidAmount(undefined)
	}, [])

	const { currentBid } = property.details ?? {}
	const isLoading = loadingBid || loadingReserve
	const insufficientBid = Number(bidAmount ?? 0) <= Number(currentBid)
	const isOwner = account.address === owner
	const actionText = isOwner ? 'Set Reserve' : 'Place Bid'
	const bidTooltip = `${isOwner ? 'Reserve' : 'Bid'} too low`

	return (
		<>
			<BasicModal
				onClose={onClose}
				closeAfter={isLoading}
				trigger={children}
				ok={
					<Tooltip hasArrow label={bidTooltip} isDisabled={!insufficientBid} shouldWrapChildren>
						<Button disabled={insufficientBid} colorScheme='orange' onClick={handleOnClick} isLoading={isLoading}>
							{actionText}
						</Button>
					</Tooltip>
				}>
				{<PropertyDetail propId={propId} />}
				<FormControl>
					<Input
						mb={2}
						type='number'
						placeholder='ETH'
						onChange={(e) => {
							if (isFinite(parseFloat(String(e.target.value)))) {
								setBidAmount(ethers.utils.parseEther(e.target.value))
							}
						}}
					/>
				</FormControl>
			</BasicModal>
		</>
	)
}
