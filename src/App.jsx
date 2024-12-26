import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddPackage from './componnets/AddPackage'
import PackagesList from './componnets/PackagesList'
import UsersList from './componnets/UsersList'
import AddPayment from "./componnets/AddPayment"
import { UserContextProvider } from './context/UserContext'
import AddUser from './componnets/AddUser.jsx'
import UpdatePackage from './componnets/UpdatePackage'
import UpdateUser from './componnets/UpdateUser'
import PaymentsList from './componnets/PaymentsList'
import { PaymentContextProvider } from './context/PaymentContext'
import { PackageContextProvider } from './context/packageContext'
import UpdatePayment from './componnets/UpdatePayment'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/packages" element={<PackageContextProvider><PackagesList /></PackageContextProvider>} />
        <Route path="/packages/add" element={<PackageContextProvider><AddPackage /></PackageContextProvider>} />
        <Route path="/packages/update/:id" element={<PackageContextProvider><UpdatePackage /></PackageContextProvider>} />

        <Route path="/users" element={<UserContextProvider><UsersList /></UserContextProvider>} />
        <Route path="/users/add" element={<UserContextProvider> <PackageContextProvider> <AddUser /></PackageContextProvider></UserContextProvider>} />
        <Route path="/users/update/:id" element={<UserContextProvider><PackageContextProvider><UpdateUser /></PackageContextProvider></UserContextProvider>} />


        <Route path="/payments" element={<PaymentContextProvider><PaymentsList/></PaymentContextProvider>} />
        <Route path="/payments/add" element={<PaymentContextProvider><UserContextProvider><AddPayment/></UserContextProvider></PaymentContextProvider>} />
        <Route path="/payments/update/:id" element={<PaymentContextProvider><UserContextProvider><UpdatePayment/></UserContextProvider></PaymentContextProvider>} />
        
        
        
      </Routes>
    </Router>
  )
}

export default App