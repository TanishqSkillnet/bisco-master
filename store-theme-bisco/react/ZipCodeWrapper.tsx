import {
  useZipCodeDispatch,
  ZipCodeProvider
} from 'biscoind.zip-code-context/ZipCodeContext'
import React, { useEffect } from 'react'

const ZipCodeCustom = ({ children }: any) => {
  const hasLocalStorage = typeof localStorage !== 'undefined'
  const dispatch = useZipCodeDispatch()
  const zipFromLocalStorage = hasLocalStorage ? (localStorage.getItem('userPostalCode') as string) : ''

  useEffect(() => {
    if (zipFromLocalStorage) {
      dispatch({
        args: { zipCodeValue: zipFromLocalStorage },
        type: 'SET_ZIP_CODE',
      })
    }
  }, [zipFromLocalStorage, dispatch])

  return <section>{children}</section>
}

const ZipCodeWrapper = (props: any) => {
  return (
    <ZipCodeProvider>
      <ZipCodeCustom {...props} />
    </ZipCodeProvider>
  )
}

export default ZipCodeWrapper
