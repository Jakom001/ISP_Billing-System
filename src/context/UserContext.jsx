import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchUsers } from '../api/userApi';


const UserContext = createContext();

export const UserContextProvider = ({children}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      try{
        const response = await fetchUsers();
        setUsers(response.data.data);
        console.log("Fetched users:", response);
      }catch (error){
        console.error("Error fetching users:", error.message);
      }finally{
        setLoading(false);
      }
  };
  loadUsers();
  }, []);


  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };




  return (
    <UserContext.Provider value={{users, setUsers, addUser, loading, error}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used within UserContextProvider");
  return context;
};