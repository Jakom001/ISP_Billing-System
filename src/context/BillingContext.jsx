import React, { useContext, useState } from 'react'

const UserPackageContext = useContext();

export const UserPackagetProvider = ({children}) => {

  const [userFormData, setFormData] = useState({
    type: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    package: "",
    email: "",
    expiryDate: '',
    phonenumber: "",
    address: "",
    comment: "",
  })
    
  const [PackageFormData, setPackageFormData] = useState({
    packageName: "",
    type: "",
    price: "",
    uploadSpeed: "",
    downloadSpeed: ""
  })

  const connectionTypes = [
    {value: 'PPPoE', label: "PPPoE"},
    {value: 'hotspot', label: "Hotspot"},
  ];
  
    return (
    <BillingContext.Provider value={{}}>
        {children}
    </BillingContext.Provider>
  )
}

export default BillingContextProvider