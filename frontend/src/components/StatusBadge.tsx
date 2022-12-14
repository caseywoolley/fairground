import { Text } from '@chakra-ui/react'
import { useOnMount, usePageRefresh } from '@hooks'
import { getHumanReadableDate, getTimestamp, isExpired } from '@utils'
import { BigNumber } from 'ethers/lib/ethers'
import React, { useCallback, useState } from 'react'
import Countdown, { CountdownProps, CountdownRenderProps } from 'react-countdown'

const defaultOffset = 30000
const rentPeriod = 10 * 60 * 1000

const getDateText = (data: CountdownRenderProps, timestamp: number, isAuction: boolean, isOwner?: boolean) => {
	const { days, hours, minutes, seconds, completed } = data
	const endText = isAuction ? 'Auction ends' : 'Lease renews'
	const transactionText = isOwner ? 'Purchased' : 'Sold'
	const completedText = isAuction ? transactionText : 'Expired'
	const prefix = completed ? completedText : days > 30 ? endText : `${endText} in`
	const dateText = getHumanReadableDate(timestamp)
	const countDownText =
		days > 30 ? dateText : days ? `${days + 1} days` : hours ? `${hours + 1} hours` : minutes ? `${minutes + 1} minutes` : seconds ? `${seconds} seconds` : dateText

	return timestamp === defaultOffset ? 'New' : `${prefix} ${countDownText}`
}

export type StatusBadgeProps = Omit<CountdownProps, 'date'> & {
	auctionEnd: BigNumber
	rentReset: BigNumber
	isOwner?: boolean
	transfered?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ auctionEnd, rentReset, isOwner, ...rest }) => {
	const [active, setActive] = useState(false)
	const pageRefresh = usePageRefresh()
	const isAuction = getTimestamp(auctionEnd) > getTimestamp(rentReset) - rentPeriod || !isExpired(auctionEnd)
	const date = isAuction ? Number(auctionEnd) : Number(rentReset)
	const timestamp = getTimestamp(date, defaultOffset)

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
