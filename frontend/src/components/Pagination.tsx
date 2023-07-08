import { Button, IconButton, HStack, Icon, Text, Spinner, Box } from '@chakra-ui/react'
import { usePropertyList, useStore, useTotalSupply } from '@hooks'
import React, { useCallback } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export interface PaginationProps {
	max: number
}

export const Pagination: React.FC<PaginationProps> = ({ max }) => {
	const totalSupply = useTotalSupply()
	const properties = usePropertyList()
	const { count, page } = useStore((store) => store.pagination)

	const setPage = useCallback(
		(page: number) => {
			properties.refresh({ page })
		},
		[properties],
	)

	const gotToPage = useCallback(
		(page: number) => () => {
			setPage(page)
		},
		[setPage],
	)

	const pageUp = useCallback(() => setPage(page + 1), [page, setPage])
	const pageDown = useCallback(() => setPage(page - 1), [page, setPage])

	const pageButton = useCallback(
		(num: number, key?: string) => {
			if (num < 1 || num > max) {
				return null
			}

			return (
				<Button key={key ?? num} disabled={properties.loading} colorScheme={page === num ? 'orange' : undefined} onClick={gotToPage(num)}>
					{num}
				</Button>
			)
		},
		[gotToPage, max, page, properties.loading],
	)

	if (count >= Number(totalSupply.count)) {
		return null
	}

	const buttonCount = 5
	const halfCount = Math.floor(buttonCount / 2)
	const isRangeStart = page < buttonCount - 1
	const isRangeEnd = max - page < halfCount + 1

	const buttonRange = Array.from({ length: buttonCount }, (_, i) => {
		if (isRangeStart) {
			return i + 1
		} else if (isRangeEnd) {
			return max - (buttonCount - 1) + i
		}

		return page - halfCount + i
	})

	return (
		<HStack>
			<Spinner visibility={properties.loading ? 'visible' : 'hidden'} pr={2} />
			<IconButton onClick={pageDown} disabled={page - 1 < 1} aria-label='back' icon={<Icon as={IoIosArrowBack}></Icon>} />
			{buttonRange[0] > 1 && pageButton(1, 'min')}
			{buttonRange[0] > 2 && (
				<Text fontSize='xl' fontWeight='black' color='gray.400'>
					...
				</Text>
			)}
			{buttonRange.map((num) => pageButton(num))}
			{buttonRange[buttonRange.length - 1] < max && (
				<Text fontSize='xl' fontWeight='black' color='gray.400'>
					...
				</Text>
			)}
			{buttonRange[buttonRange.length - 1] < max - 1 && pageButton(max, 'max')}
			<IconButton onClick={pageUp} disabled={page + 1 > max} aria-label='forward' icon={<Icon as={IoIosArrowForward}></Icon>} />
		</HStack>
	)
}
