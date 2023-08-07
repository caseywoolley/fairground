import { ChakraProvider } from '@chakra-ui/react'
import { lightTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { polygonMumbai, sepolia, localhost } from 'wagmi/chains'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import React from 'react'

const SEPOLIA_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API_KEY || ''
const MUMBAI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY || ''
const isDev = process.env.NODE_ENV === 'development'
const appName = 'Fairground'

const { chains, provider } = configureChains(
	[sepolia, polygonMumbai, ...(isDev ? [localhost] : [])],
	[
		alchemyProvider({ apiKey: MUMBAI_API_KEY }),
		jsonRpcProvider({
			rpc: (chain) => ({
				http: chain.id === sepolia.id ? `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}` : '',
			}),
		}),
		publicProvider(),
		jsonRpcProvider({
			rpc: () => ({
				http: 'http://localhost:8545',
			}),
		}),
	],
)

const { connectors } = getDefaultWallets({ appName, chains })

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
})

export default function App({ Component, pageProps }: AppProps) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={lightTheme({
					borderRadius: 'small',
					accentColor: '#dd6b20',
				})}>
				<React.StrictMode>
					<ChakraProvider>
						<Component {...pageProps} />
					</ChakraProvider>
				</React.StrictMode>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
