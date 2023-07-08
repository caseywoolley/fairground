import { useCallback, useState } from 'react'
import { Fairground as FairgroundType } from 'typechain'
import Fairground from 'artifacts/contracts/Fairground.sol/Fairground.json'
import { useToast, UseToastOptions } from '@chakra-ui/react'
import { useProvider, useContract as useWagmiContract, useSigner } from 'wagmi'
import { useContractAddress } from '@hooks'

export type ContractCallback<T = unknown> = (contract: FairgroundType) => Promise<T>
export type ContractOnError = (err: unknown) => void
export type ContractOnSuccess = () => void

export type UseContractOptions<T> = {
	callback: ContractCallback<T>
	successMessage?: string
	errorMessage?: string
	onError?: ContractOnError
	onSuccess?: ContractOnSuccess
}

export type CallContract = <T = unknown>(options: UseContractOptions<T>) => Promise<T | void>

export type UseContractResult = {
	callContract: CallContract
	callContractWithSigner: CallContract
	loading: boolean
}

export const toastDefaults: Partial<UseToastOptions> = {
	variant: 'subtle',
	position: 'top',
	isClosable: true,
}

export const useContract = (): UseContractResult => {
	const toast = useToast()
	const [loading, setLoading] = useState(false)
	const provider = useProvider()
	const { data: signer } = useSigner()
	const CONTRACT_ADDRESS = useContractAddress()

	const contract = useWagmiContract({
		address: CONTRACT_ADDRESS,
		abi: Fairground.abi,
		signerOrProvider: provider,
	}) as FairgroundType

	const contractWithSigner = useWagmiContract({
		address: CONTRACT_ADDRESS,
		abi: Fairground.abi,
		signerOrProvider: signer,
	}) as FairgroundType

	const callContract = useCallback(
		<T = unknown>(contract?: FairgroundType, hasSigner?: boolean) =>
			async (options: UseContractOptions<T>) => {
				const { callback, onError, onSuccess, successMessage, errorMessage } = options

				if (contract) {
					let failed = false
					try {
						setLoading(true)
						await callback(contract)
					} catch (err) {
						failed = true

						if (onError) {
							onError(err)
						}

						if (errorMessage) {
							toast({
								...toastDefaults,
								status: 'error',
								title: errorMessage,
							})
						} else if (hasSigner) {
							toast({
								...toastDefaults,
								status: 'info',
								title: 'Transaction incomplete',
							})
						}
					} finally {
						setLoading(false)
						if (!failed && onSuccess) {
							onSuccess()
						}

						if (!failed && successMessage) {
							toast({
								...toastDefaults,
								status: 'success',
								title: successMessage,
							})
						}
					}
				}
			},
		[CONTRACT_ADDRESS, provider, signer, toast],
	)

	return {
		callContract: callContract(contract),
		callContractWithSigner: callContract(contractWithSigner, true),
		loading,
	}
}
