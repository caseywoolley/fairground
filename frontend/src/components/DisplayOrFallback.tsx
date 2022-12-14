import React from 'react'

export type DisplayOrFallbackProps = {
	children: React.ReactNode
	display: React.ReactNode
}

export const DisplayOrFallback: React.FC<DisplayOrFallbackProps> = ({ children, display }) => {
	return <>{display ? display : children}</>
}
