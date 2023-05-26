import { Flex, Spacer, Text } from '@chakra-ui/react'
import { IconLink, LocalFaucetButton } from '@components'
import { DistributeFunds } from '@components/contract'
import React from 'react'
import { FaFacebook, FaLink, FaLinkedin, FaMedium, FaTwitter } from 'react-icons/fa'
import { IoNewspaperOutline } from 'react-icons/io5'

const iconSize = 5

export const Footer: React.FC = () => (
	<footer>
		<Flex py={8} alignItems='center'>
			<IconLink icon={IoNewspaperOutline} url='https://drive.google.com/file/d/1_636cLWhI-LZw_KYkIm6hjNDM8dZSsMn/view' iconSize={iconSize} />
			<IconLink icon={FaLink} url='https://joinfairground.com' iconSize={iconSize} />
			<IconLink icon={FaTwitter} url='https://twitter.com/joinfairground' iconSize={iconSize} />
			<IconLink icon={FaFacebook} url='https://www.facebook.com/joinfairground' iconSize={iconSize} />
			<IconLink icon={FaLinkedin} url='https://www.linkedin.com/company/fairground-cryptocurrency' iconSize={iconSize} />
			<IconLink icon={FaMedium} url='https://medium.com/fairground' iconSize={iconSize} />
			<Spacer></Spacer>
			<DistributeFunds />
			<Spacer></Spacer>
			<LocalFaucetButton />
			<Text as='span' p='2' fontSize={12}>
				Fairground {new Date().getFullYear()}
			</Text>
		</Flex>
	</footer>
)
