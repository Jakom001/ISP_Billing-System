import React, { useState, useEffect } from 'react'
import {useUserContext} from "../context/UserContext"
import { Eye, EyeOff } from 'lucide-react';
import {addUser} from "../api/userApi"
import { usePackageContext } from '../context/packageContext';
import { Link } from 'react-router-dom';

const AddUser = () => {
  const {setUsers} = useUserContext();
  const { packages, fetchPackages } = usePackageContext();
  
  useEffect(() => {
     fetchPackages();
   }, [fetchPackages]);
 
  const [formData, setFormData] = useState({
    type: "",
    firstName: "",
    lastName: "",
    username:"",
    userPaass:"",
    confirmUserPaass:"",
    packageId:"",
    email: "",
    connectionExpiryDate:'',
    phoneNumber:"",
    address:"",
    comment:"",
})
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showUserPaass, setShowUserPaass] = useState(false);
  const [showConfirmUserPaass, setShowConfirmUserPaass] = useState(false);

  const presetDates = [
    { value: "3day", label: "3 Days" },
    { value: "1week", label: "1 Week" },
    { value: "2weeks", label: "2 Weeks" },
    { value: "1month", label: "1 Month" },
    { value: "2months", label: "2 Months" },
    { value: "1year", label: "1 Year" },
    { value: "custom", label: "Custom Date" }
  ];

  const calculateExpiryDate = (preset) => {
    const today = new Date();
    let connectionExpiryDate = new Date();
    connectionExpiryDate.setHours(23, 59, 0, 0);
    switch (preset) {
      case "3days":
        connectionExpiryDate.setDate(today.getDate() + 3);
        break;
      case "1week":
        connectionExpiryDate.setDate(today.getDate() + 7);
        break;
      case "2weeks":
        connectionExpiryDate.setDate(today.getDate() + 14);
        break;
      case "1month":
        connectionExpiryDate.setMonth(today.getMonth() + 1);
        break;
      case "2months":
        connectionExpiryDate.setMonth(today.getMonth() + 2);
        break;
      case "1year":
        connectionExpiryDate.setFullYear(today.getFullYear() + 1);
        break;
      default:
        return "";
    }

    return connectionExpiryDate.toISOString().split('T')[0];
  };

const [dateInputType, setDateInputType] = useState('preset');
const [selectedPreset, setSelectedPreset] = useState('');

const handlePresetChange = (e) => {
const preset = e.target.value;
setSelectedPreset(preset);

if (preset === 'custom') {
  setDateInputType('custom');
  setFormData(prev => ({
    ...prev,
    connectionExpiryDate: ''
  }));
} else {
  setDateInputType('preset');
  setFormData(prev => ({
    ...prev,
    connectionExpiryDate: calculateExpiryDate(preset)
  }));
}
};

  const connectionTypes = [
    {value: 'PPPoE', label: "PPPoE"},
    {value: 'Hotspot', label: "Hotspot"},
]

  const validateForm = () =>{
    const newErrors = {};

    if (!formData.type){
        newErrors.type = 'Connection type is required';
    }

    if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      
    if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
        newErrors.username = 'Username must be at least 4 characters';
    }

    if (!formData.userPaass) {
        newErrors.userPaass = 'UserPaass is required';
    } else if (formData.userPaass.length < 6) {
        newErrors.userPaass = 'UserPaass must be at least 6 characters';
    }

    if (!formData.confirmUserPaass) {
        newErrors.confirmUserPaass = 'Please confirm your userPaass';
    } else if (formData.userPaass !== formData.confirmUserPaass) {
        newErrors.confirmUserPaass = 'UserPaasss do not match';
    }

    if (!formData.email) {
        newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
    }

    if (!formData.packageId) {
        newErrors.packageId = 'Please select a package';
    }

    if (!formData.connectionExpiryDate) {
        newErrors.connectionExpiryDate = 'Expiry date is required';
    } else {
        const selectedDate = new Date(formData.connectionExpiryDate);
        const today = new Date();
        if (selectedDate < today) {
            newErrors.connectionExpiryDate = 'Expiry date cannot be in the past';
        }
    }
    if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) {
    newErrors.address = 'Address is required';
    }
    if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData, [name]:value,
    }));
    if(errors[name]){
      setErrors(prev =>({
        ...prev, [name]: ""
      }));
    }
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if(validateForm()){
      try{
         const {data} = await addUser(formData);
        setUsers((prevUsers) => [...prevUsers, data]);
        
        setSubmitted(true)

        // Reset Form
        setFormData({
          type: "",
          firstName: "",
          lastName: "",
          username: "",
          userPaass: "",
          confirmUserPaass: "",
          packageId: "",
          email: "",
          connectionExpiryDate: "",
          phoneNumber: "",
          address: "",
          comment: "",
        })
        setTimeout(() =>setSubmitted(false), 3000)
      }catch (error){
        console.error("Submission Error", error)
         const backendError =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to submit form. Please try again.";

      // Update the errors state with the backend error
      setErrors((prev) => ({
        ...prev,
        submit: backendError,
      }));

      }
    }else{
      console.log("Form has errors", errors);
     }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white text-blackColor shadow-md rounded-lg px-8 py-6">
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>
            Create Users
          </h2>
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              Form submitted successfully!
            </div>
          )}
          
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor="type">
                  Connection Type</label>
                  <select name="type" id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value="">Select Connection Type</option>
                      {connectionTypes.map((type) =>(
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                  </select>
                  {errors.type && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.type}
                    </p>
                  )}
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UserPaass
              </label>
              <div className="relative">
                <input
                  type={showUserPaass ? "text" : "userPaass"}
                  name="userPaass"
                  value={formData.userPaass}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowUserPaass(!showUserPaass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showUserPaass ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.userPaass && (
                <p className="mt-1 text-sm text-red-600">{errors.userPaass}</p>
              )}
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm UserPaass
            </label>
            <div className="relative">
              <input
                type={showConfirmUserPaass ? "text" : "userPaass"}
                name="confirmUserPaass"
                value={formData.confirmUserPaass}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmUserPaass(!showConfirmUserPaass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmUserPaass ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmUserPaass && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmUserPaass}</p>
            )}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package
              </label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.packageName}
                  </option>
                ))}
              </select>
              {errors.packageId && (
                <p className="mt-1 text-sm text-red-600">{errors.packageId}</p>
              )}
            </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <select
                value={selectedPreset}
                onChange={handlePresetChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select duration</option>
                {presetDates.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {dateInputType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Expiry Date
                </label>
                <input
                  type="datetime-local"
                  name="connectionExpiryDate"
                  value={formData.connectionExpiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {errors.connectionExpiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.connectionExpiryDate}</p>
            )}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
              
            <div className="flex justify-between">
              <button
                type="submit"
                className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Add User
              </button>

              <button className="mt-4">
                <Link to="/users" className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">Cancel</Link>
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser