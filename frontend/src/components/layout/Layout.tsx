import { Box, Container } from '@chakra-ui/react'
import React from 'react'
import { Head, Meta } from './Head'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
	children: React.ReactNode
	customMeta?: Meta
}

export const Layout: React.FC<LayoutProps> = ({ children, customMeta }) => {
	return (
		<Container maxWidth='1600px' display='flex' flexDir='column' height='100vh'>
			<Head customMeta={customMeta} />
			<Header />
			<Box as='main'>{children}</Box>
			<Footer />
		</Container>
	)
}
