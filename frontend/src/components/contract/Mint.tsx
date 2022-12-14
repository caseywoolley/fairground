import { Button, FormControl, FormErrorMessage, FormLabel, Icon, Input } from '@chakra-ui/react'
import { BasicModal, PropertyId } from '@components'
import { useMint, useTotalSupply } from '@hooks'
import { isAddress } from 'ethers/lib/utils'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useAccount } from 'wagmi'

export const Mint: React.FC = () => {
	const account = useAccount()
	const totalSupply = useTotalSupply()
	const [mintTo, setMintTo] = useState('0x00')
	const { loading, mint } = useMint()
	const isInvalid = !isAddress(mintTo)

	const mintProperty = useCallback(() => mint(mintTo), [mint, mintTo])

	const onModalOpen = useCallback(() => {
		setMintTo(String(account.address))
	}, [account])

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setMintTo(e.target?.value)
	}, [])

	return (
		<BasicModal
			closeAfter={loading}
			triggerText='Mint Property'
			header={<PropertyId number={Number(totalSupply.count) + 1} />}
			onOpen={onModalOpen}
			trigger={
				<Button rightIcon={<Icon as={FaPlus} />} colorScheme='orange'>
					New
				</Button>
			}
			ok={
				<Button colorScheme='orange' isLoading={loading} isDisabled={isInvalid} onClick={mintProperty}>
					Add
				</Button>
			}>
			<FormControl isInvalid={isInvalid}>
				<FormLabel>Owner</FormLabel>
				<Input maxLength={42} isInvalid={isInvalid} type='text' onChange={handleChange} value={mintTo} placeholder={'Wallet address'} />
				{!isAddress(mintTo) && <FormErrorMessage>Invalid wallet address</FormErrorMessage>}
			</FormControl>
		</BasicModal>
	)
}
