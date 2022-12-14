import { useEffect } from 'react'

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useOnUnmount = (onUnmount: () => void) => useEffect(() => onUnmount, [])
