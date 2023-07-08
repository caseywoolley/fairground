import { ChakraProvider } from '@chakra-ui/react'
import { lightTheme, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import type { AppProps } from 'next/app'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import React from 'react'

const SEPOLIA_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API_KEY || ''
const GOERLI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY || ''
const MUMBAI_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_API_KEY || ''
const MAINNET_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY || ''
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY || ''
const enableTestnets = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
const appName = 'Fairground'

const { chains, provider, webSocketProvider } = configureChains(
	[chain.mainnet, chain.polygon, ...(enableTestnets ? [chain.polygonMumbai, chain.sepolia, chain.goerli, chain.localhost] : [])],
	[
		alchemyProvider({ apiKey: SEPOLIA_API_KEY }),
		alchemyProvider({ apiKey: GOERLI_API_KEY }),
		alchemyProvider({ apiKey: MUMBAI_API_KEY }),
		alchemyProvider({ apiKey: MUMBAI_API_KEY }),
		alchemyProvider({ apiKey: POLYGON_API_KEY }),
		alchemyProvider({ apiKey: MAINNET_API_KEY }),
		jsonRpcProvider({
			rpc: () => ({
				http: 'http://localhost:8545',
				webSocket: 'wss://localhost:8545',
			}),
		}),
		publicProvider(),
	],
)

const { connectors } = getDefaultWallets({ appName, chains })

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
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
