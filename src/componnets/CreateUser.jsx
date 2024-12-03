import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        type: "",
        firstName: "",
        lastName: "",
        username:"",
        password:"",
        confirmPassword:"",
        package:"",
        email: "",
        expiryDate:'',
        phonenumber:"",
        address:"",
        comment:"",
    })

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const packages = [
        {value: "", label: "Select a package"},
        {value: "3mbps", label: "3 Mbps Profile"},
        {value: "5mbps", label: "5 Mbps Profile"},
        {value: "6mbps", label: "6 Mbps Profile"},
        {value: "8mbps", label: "8 Mbps Profile"},
        {value: "10mbps", label: "10 Mbps Profile"},
        {value: "custom", label: "Custom Package"}
    ];
    
    const presetDates = [
        { value: "3days", label: "3 Days" },
        { value: "1week", label: "1 Week" },
        { value: "2weeks", label: "2 Weeks" },
        { value: "1month", label: "1 Month" },
        { value: "2months", label: "2 Months" },
        { value: "1year", label: "1 Year" },
        { value: "custom", label: "Custom Date" }
      ];

      const calculateExpiryDate = (preset) => {
        const today = new Date();
        let expiryDate = new Date();
    
        switch (preset) {
          case "3days":
            expiryDate.setDate(today.getDate() + 3);
            break;
          case "1week":
            expiryDate.setDate(today.getDate() + 7);
            break;
          case "2weeks":
            expiryDate.setDate(today.getDate() + 14);
            break;
          case "1month":
            expiryDate.setMonth(today.getMonth() + 1);
            break;
          case "2months":
            expiryDate.setMonth(today.getMonth() + 2);
            break;
          case "1year":
            expiryDate.setFullYear(today.getFullYear() + 1);
            break;
          default:
            return "";
        }
    
        return expiryDate.toISOString().split('T')[0];
      };

    const [dateInputType, setDateInputType] = useState('preset');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    setSelectedPreset(preset);
    
    if (preset === 'custom') {
      setDateInputType('custom');
      setFormData(prev => ({
        ...prev,
        expiryDate: ''
      }));
    } else {
      setDateInputType('preset');
      setFormData(prev => ({
        ...prev,
        expiryDate: calculateExpiryDate(preset)
      }));
    }
  };
    
    const connectionTypes = [
        {value: 'PPPoE', label: "PPPoE"},
        {value: 'hotspot', label: "Hotspot"},
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

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.package) {
            newErrors.package = 'Please select a package';
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
        } else {
            const selectedDate = new Date(formData.expiryDate);
            const today = new Date();
            if (selectedDate < today) {
                newErrors.expiryDate = 'Expiry date cannot be in the past';
            }
        }
        if (!formData.phonenumber) {
            newErrors.phonenumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phonenumber.replace(/\D/g, ''))) {
            newErrors.phonenumber = 'Please enter a valid 10-digit phone number';
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
        setFormData((prevData) =>({
            ...prevData, [name]:value,
        }));
        if (errors[name]){
            setErrors(prev => ({
                ...prev, [name]: ""
            }));
        }
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        if (validateForm()){
            try{
                // await axios.post('/api/subscriptions', formData);
                console.log("Submitted Data:", formData);
                setSubmitted(true)

                // Reset form
                setFormData({
                    type: "",
                    firstName: "",
                    lastName: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    package: "",
                    email: "",
                    expiryDate: "",
                    phonenumber: "",
                    address: "",
                    comment: "",
                  });
                // Clear success message after 3 seconds
                setTimeout(() => setSubmitted(false), 3000)
            }catch (error){
                console.error("Submission Error", error)
                setErrors(prev =>({
                    ...prev,
                    submit: 'Falied to submit form. Please try again.'
                }))
            }
            

        }else{
            console.log("Form has errors", errors);
        }
        
    }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white text-blackColor shadow-md rounded-lg px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Subscription Form</h2>
          
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Connection Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select connection type</option>
                {connectionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Name Fields */}
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

            {/* Username and Password */}
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
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Confirm Password field with eye icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {packages.map((pkg) => (
                  <option key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </option>
                ))}
              </select>
              {errors.package && (
                <p className="mt-1 text-sm text-red-600">{errors.package}</p>
              )}
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.phonenumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phonenumber}</p>
                )}
              </div>
            </div>

            {/* Expiry Date */}
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
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>

            {/* Address */}
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

            {/* Comments */}
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser