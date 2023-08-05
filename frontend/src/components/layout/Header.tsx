import { Flex, Image, Link, Text, Spacer, Tooltip } from '@chakra-ui/react'

import React from 'react'
import { IconLink } from '@components'
import { FaMedium, FaTwitter } from 'react-icons/fa'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const version = '0.0.2'

const versionDescription = (
	<section>
		<div>{`Fairground v${version} (Proof of Concept)`}</div>
		<div>For testing purposes:</div>
		<div>30 day auction = 3 minutes</div>
		<div>1 year lease = 10 minutes</div>
	</section>
)

export const Header: React.FC = () => {
	return (
		<header>
			<Flex alignItems='center' pt={4} gridGap={12}>
				<Link target='_blank' href='https://joinfairground.com' style={{ textDecoration: 'none' }}>
					<Flex alignItems='center' shrink='0'>
						<Image src='/images/logo-fairground-wide.svg' alt='fairground-logo' width={200} display='inline-block' />
						<Tooltip hasArrow label={versionDescription} shouldWrapChildren placement='top'>
							<Text as='span' fontSize='sm' pl={2} pb='0px' color='orange.400'>
								{version}
							</Text>
						</Tooltip>
					</Flex>
				</Link>
				<Link fontSize='sm' target='_blank' href='https://drive.google.com/file/d/1_636cLWhI-LZw_KYkIm6hjNDM8dZSsMn/view'>
					White Paper
				</Link>
				<Link fontSize='sm' target='_blank' href='https://joinfairground.com'>
					Newsletter
				</Link>
				<Spacer />
				<Flex alignItems='center'>
					<IconLink icon={FaTwitter} url='https://twitter.com/joinfairground' iconSize={5} />
					<IconLink icon={FaMedium} url='https://medium.com/fairground' iconSize={5} />
				</Flex>
				<ConnectButton />
			</Flex>
		</header>
	)
}
