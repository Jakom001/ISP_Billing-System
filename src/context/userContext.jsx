import React, { Children, useContext } from 'react'

const userContext = useContext()
const userContextProvider = ({children}) => {
  return (
    <userContext.Provider value={{}}>
        {children}

    </userContext.Provider>
  )
}

export default userContextProvider