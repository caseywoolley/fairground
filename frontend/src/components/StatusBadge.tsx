import { Text } from '@chakra-ui/react'
import { useOnMount, usePageRefresh } from '@hooks'
import { getHumanReadableDate, getTimestamp, isExpired } from '@utils'
import React, { useCallback, useState } from 'react'
import Countdown, { CountdownProps, CountdownRenderProps } from 'react-countdown'
import { useAccount } from 'wagmi'
import { FairgroundProperty } from './Property'

const blocktimeOffset = 15000

const getDateText = (data: CountdownRenderProps, timestamp: number, isAuction: boolean, isOwner?: boolean) => {
	const { days, hours, minutes, seconds, completed } = data
	const endText = isAuction ? 'Auction ends' : 'Lease renews'
	const transactionText = isOwner ? 'Purchased' : 'Sold'
	const completedText = isAuction ? transactionText : 'Lease expired'
	const prefix = completed ? completedText : days > 30 ? endText : `${endText} in`
	const dateText = getHumanReadableDate(timestamp)
	const countDownText =
		days > 30 ? dateText : days ? `${days + 1} days` : hours ? `${hours + 1} hours` : minutes ? `${minutes + 1} minutes` : seconds ? `${seconds} seconds` : dateText

	return timestamp === blocktimeOffset ? 'New' : `${prefix} ${countDownText}`
}

export type StatusBadgeProps = Omit<CountdownProps, 'date'> & {
	property: FairgroundProperty
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ property, ...rest }) => {
	const { auctionEnd, leaseEnd, owner, recordedOwner, topBidder } = property
	const pageRefresh = usePageRefresh()
	const account = useAccount()
	const [active, setActive] = useState(false)
	const isAuction = Boolean(Number(topBidder)) || owner !== recordedOwner
	const date = isAuction ? Number(auctionEnd) : Number(leaseEnd)
	const timestamp = getTimestamp(date, blocktimeOffset)
	const isOwner = account.address === owner

	useOnMount(() => {
		if (!isExpired(timestamp)) {
			setActive(true)
		}

		return () => setActive(false)
	})

	const onComplete = useCallback(() => {
		if (active) {
			pageRefresh()
		}
	}, [active, pageRefresh])

	const renderer = useCallback(
		(data: CountdownRenderProps) => (
			<Text fontSize='sm' color='gray.600'>
				{getDateText(data, timestamp, isAuction, isOwner)}
			</Text>
		),
		[isAuction, timestamp, isOwner],
	)

	return <Countdown renderer={renderer} onComplete={onComplete} key={Number(date)} date={timestamp} {...rest}></Countdown>
}
