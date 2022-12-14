import NextHead from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

export const WEBSITE_HOST_URL = 'https://fairground.vercel.app/'

export interface Meta {
	description?: string
	image?: string
	title: string
	type?: string
}

interface HeadProps {
	customMeta?: Meta
}

export const Head: React.FC<HeadProps> = ({ customMeta }) => {
	const router = useRouter()
	const meta: Meta = {
		title: 'Fairground',
		description: 'Fairground Blockchain Land Protocol And Registry',
		image: `${WEBSITE_HOST_URL}/images/site-preview.png`,
		type: 'website',
		...customMeta,
	}

	return (
		<NextHead>
			<title>{meta.title}</title>
			<meta content={meta.description} name='description' />
			<meta property='og:url' content={`${WEBSITE_HOST_URL}${router.asPath}`} />
			<link rel='canonical' href={`${WEBSITE_HOST_URL}${router.asPath}`} />
			<meta property='og:type' content={meta.type} />
			<meta property='og:site_name' content={meta.title} />
			<meta property='og:description' content={meta.description} />
			<meta property='og:title' content={meta.title} />
			<meta property='og:image' content={meta.image} />
			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:site' content='@joinfairground' />
			<meta name='twitter:title' content={meta.title} />
			<meta name='twitter:description' content={meta.description} />
			<meta name='twitter:image' content={meta.image} />
		</NextHead>
	)
}
