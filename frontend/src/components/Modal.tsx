import {
	Box,
	Button,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalContentProps,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	usePrevious,
} from '@chakra-ui/react'
import React, { useCallback, useEffect } from 'react'
import { DisplayOrFallback } from './DisplayOrFallback'

export type BasicModalProps = ModalContentProps & {
	children: React.ReactNode
	closeAfter?: boolean
	forceClose?: boolean
	header?: React.ReactNode
	ok?: React.ReactNode
	onClose?: () => void
	onOpen?: () => void
	cancel?: React.ReactNode
	hideCloseButton?: boolean
	trigger?: React.ReactNode
	triggerText?: string
}

export const BasicModal: React.FC<BasicModalProps> = ({
	cancel,
	children,
	closeAfter,
	forceClose,
	header,
	hideCloseButton,
	ok,
	onClose: onCloseCallback,
	onOpen: onOpenCallback,
	trigger,
	triggerText = 'Open',
}) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const wasCloseAfter = usePrevious(closeAfter)
	const doCloseAfter = !closeAfter && wasCloseAfter

	const handleOnOpen = useCallback(() => {
		if (onOpenCallback) {
			onOpenCallback()
		}

		onOpen()
	}, [onOpen, onOpenCallback])

	const handleOnClose = useCallback(() => {
		if (onCloseCallback) {
			onCloseCallback()
		}

		onClose()
	}, [onClose, onCloseCallback])

	useEffect(() => {
		if (forceClose || doCloseAfter) {
			onClose()
		}
	})

	return (
		<>
			{trigger ? (
				<Box onClick={handleOnOpen}>{trigger}</Box>
			) : (
				<Button colorScheme='orange' onClick={handleOnOpen}>
					{triggerText}
				</Button>
			)}
			<Modal isOpen={isOpen} onClose={handleOnClose} size='lg' preserveScrollBarGap>
				<ModalOverlay />
				<ModalContent>
					{header && <ModalHeader>{header}</ModalHeader>}
					{!hideCloseButton && <ModalCloseButton />}
					<ModalBody pt={!header ? '50px' : '8px'}>{children}</ModalBody>
					<ModalFooter>
						<HStack spacing={2}>
							<DisplayOrFallback display={ok}>
								<Button colorScheme='blue' mr={3}>
									Save
								</Button>
							</DisplayOrFallback>
							<DisplayOrFallback display={cancel}>
								<Button onClick={onClose}>Cancel</Button>
							</DisplayOrFallback>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
