import React, { useState, useEffect } from "react";
import { usePackageContext } from "../context/PackageContext";
import { updatePackage, getPackageById } from "../api/packageApi";
import { useParams, useNavigate, Link } from 'react-router-dom';

const UpdatePackage = () => {
  const { fetchPackages } = usePackageContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    packageName: "",
    type: "",
    price: "",
    uploadSpeed: "",
    downloadSpeed: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await getPackageById(id);
        const packageData = response.data.data;
        setFormData({
          packageName: packageData.packageName || "",
          type: packageData.type || "",
          price: packageData.price || "",
          uploadSpeed: packageData.uploadSpeed || "",
          downloadSpeed: packageData.downloadSpeed || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching package details:", error);
        setErrors({ submit: "Failed to fetch package details. Please try again." });
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  const connectionTypes = [
    { value: "PPPoE", label: "PPPoE" },
    { value: "Hotspot", label: "Hotspot" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Enter package name i.e 10MBPS profile";
    }

    if (!formData.type) {
      newErrors.type = "Connection type is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    }
    if (!formData.uploadSpeed.trim()) {
      newErrors.uploadSpeed = "Upload speed is required";
    } else if (!/^\d+M$/.test(formData.uploadSpeed.toUpperCase())) {
      newErrors.uploadSpeed = "Enter a valid upload speed (i.e 10M, 50M)";
    }
    if (!formData.downloadSpeed.trim()) {
      newErrors.downloadSpeed = "Download speed is required";
    } else if (!/^\d+M$/.test(formData.downloadSpeed.toUpperCase())) {
      newErrors.downloadSpeed = "Enter a valid download speed (i.e 10M, 50M)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await updatePackage(id, formData);

        setSubmitted(true);
        setErrors({});

        // Fetch updated packages
        await fetchPackages();
        setTimeout(() => {
          setSubmitted(false);
          navigate('/packages'); 
        }, 3000);
      } catch (error) {

        console.error("Submission Error", error);
        const backendError =
          error.response?.data?.message || "Failed to update package. Please try again.";
        setErrors((prev) => ({
          ...prev,
          submit: backendError,
        }));
      }
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading package data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white text-blackColor shadow-md rounded-lg px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Update Package
          </h2>
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              Package updated successfully!
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Package
              </label>
              <input
                type="text"
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
                placeholder="i.e 10mbps profile, 20mbps profile"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.packageName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.packageName}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="type"
              >
                Connection Type
              </label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Connection Type</option>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Speed
              </label>
              <input
                type="text"
                name="uploadSpeed"
                value={formData.uploadSpeed}
                placeholder="i.e 10M, 20M"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.uploadSpeed && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.uploadSpeed}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Download Speed
              </label>
              <input
                type="text"
                name="downloadSpeed"
                value={formData.downloadSpeed}
                placeholder="i.e 10M, 20M"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.downloadSpeed && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.downloadSpeed}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Update Package
              </button>

              <button className="mt-4">
                <Link to="/packages" className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">Cancel</Link>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePackage;
