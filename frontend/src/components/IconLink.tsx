import { Icon, Link, LinkProps } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'

export type IconLinkProps = LinkProps & {
	icon: IconType
	iconSize: number
	url: string
}

export const IconLink: React.FC<IconLinkProps> = ({ icon, iconSize, url, ...linkProps }) => {
	return (
		<Link px='2' target='_blank' href={url} {...linkProps}>
			<Icon as={icon} color='gray.400' _hover={{ color: 'gray.500' }} w={iconSize} h={iconSize} />
		</Link>
	)
}
