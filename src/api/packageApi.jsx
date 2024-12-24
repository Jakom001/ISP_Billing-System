import apiClient from "../services/apiClient";


export const getPackages = () => apiClient.get("/packages/all-packages");
export const addPackage = (packageData) => apiClient.post("/packages/add-package", packageData);
export const updatePackage = (packageId, updatedPackageData) =>
  apiClient.put(`/packages/update-package/${packageId}`, updatedPackageData);
export const deletePackage = (packageId) => apiClient.delete(`/package/delete-package/${packageId}`);
export const getPackageById = (packageId) => apiClient.get(`/packages/single-package/${packageId}`);
