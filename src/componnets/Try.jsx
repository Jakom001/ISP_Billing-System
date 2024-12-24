import React, { useContext } from 'react'
import { useUserContext } from '../context/UserContext';

const Try = () => {
    const { users } = useUserContext();
    console.log(users);
  return (
    <div>Try</div>
  )
}

export default Try