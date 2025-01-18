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
import Navbar from './componnets/Navbar.jsx'
import Dashboard from './componnets/Dashboard.jsx'
const App = () => {
  return (
    <Router>
      <div className="h-screen py-6 px-4 sm:px-6 lg:px-8">
        <Navbar />

        <Routes>
        {/* Packages */}
        <Route path="/packages" element={<PackageContextProvider><PackagesList /></PackageContextProvider>} />
        <Route path="/packages/add" element={<PackageContextProvider><AddPackage /></PackageContextProvider>} />
        <Route path="/packages/update/:id" element={<PackageContextProvider><UpdatePackage /></PackageContextProvider>} />

        {/* Users */}
        <Route path="/users" element={<UserContextProvider><UsersList /></UserContextProvider>} />
        <Route path="/users/add" element={<UserContextProvider> <PackageContextProvider> <AddUser /></PackageContextProvider></UserContextProvider>} />
        <Route path="/users/update/:id" element={<UserContextProvider><PackageContextProvider><UpdateUser /></PackageContextProvider></UserContextProvider>} />

        {/* Payments */}
        <Route path="/payments" element={<PaymentContextProvider><PaymentsList/></PaymentContextProvider>} />
        <Route path="/payments/add" element={<PaymentContextProvider><UserContextProvider><AddPayment/></UserContextProvider></PaymentContextProvider>} />
        <Route path="/payments/update/:id" element={<PaymentContextProvider><UserContextProvider><UpdatePayment/></UserContextProvider></PaymentContextProvider>} />
        
        <Route path="/" element={<Dashboard />} />
        
      </Routes>
        
      </div>
      
    </Router>
  )
}

export default App