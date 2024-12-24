import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddPackage from './componnets/AddPackage'
import PackagesList from './componnets/PackagesList'
import UsersList from './componnets/UsersList'
import CreatePayment from "./componnets/CreatePayment"
import EditPayment from "./componnets/EditPayment"
import { UserContextProvider } from './context/UserContext'
import Try from './componnets/Try'
import AddUser from './componnets/AddUser.jsx'
import { PackageContextProvider } from './context/packageContext'
import UpdatePackage from './componnets/UpdatePackage.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/packages" element={<PackageContextProvider><PackagesList /></PackageContextProvider>} />
        <Route path="/packages/add" element={<PackageContextProvider><AddPackage /></PackageContextProvider>} />
        <Route path="/packages/update/:id" element={<PackageContextProvider><UpdatePackage /></PackageContextProvider>} />
        <Route path="/users" element={<UserContextProvider><UsersList /></UserContextProvider>} />
        <Route path="/users/add" element={<UserContextProvider><AddUser /></UserContextProvider>} />
        <Route path="/payments" element={<CreatePayment />} />
        <Route path="/payments/edit/:id" element={<EditPayment />} />
      </Routes>
    </Router>
  )
}

export default App