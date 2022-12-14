import { EffectCallback, useEffect } from 'react'

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useOnMount = (onMount: EffectCallback) => useEffect(() => onMount(), [])
