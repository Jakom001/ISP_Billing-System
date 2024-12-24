import React, { useState, useMemo, useContext } from 'react';
import DataTable from 'react-data-table-component';
import { useUserContext } from '../context/UserContext';

import { 
  Eye as ViewIcon, 
  Edit as EditIcon, 
  Trash2 as DeleteIcon 
} from 'lucide-react';


const UsersList = () => {
  const { users, loading, error } = useUserContext();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Define columns with sorting and filtering capabilities
  const columns = [
    
    {
      name: 'username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNumber,
      sortable: true,
    },
    {
      name: 'Package',
      selector: row => row.package.packageName,
      sortable: true,
    },
    {
      name: 'Connection Status',
      selector: row => row.isConnected,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded ${
          row.isConnected === true
            ? 'bg-green-100 text-green-800' 
            :  'bg-red-100 text-red-800'
        }`}>
          {row.isConnected === true ? 'Connected' : 'Disconnected'}
        </span>
      )
    },

    {
      name: "Expiry",
      selector: row => row.connectionExpiryDate,
      sortable: true,
      cell: row => {
        const now = new Date(); // Current date and time
        const expiryDate = new Date(row.connectionExpiryDate); // Convert to Date object
    
        const isExpired = expiryDate < now; // Compare expiry date with current date
    
        return (
          <span
            className={`px-2 py-1 rounded ${
              isExpired
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800' 
            }`}
          >
            {isExpired ? 'Expired' : expiryDate.toLocaleDateString('en-GB')} 
          </span>
        );
      }
    },
  
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          {/* View Button */}
          <button 
            onClick={() => handleView(row)}
            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
            title="View User"
          >
            <ViewIcon size={20} />
          </button>

          {/* Edit Button */}
          <button 
            onClick={() => handleEdit(row)}
            className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100"
            title="Edit User"
          >
            <EditIcon size={20} />
          </button>

          {/* Delete Button */}
          <button 
            onClick={() => handleDelete(row)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
            title="Delete User"
          >
            <DeleteIcon size={20} />
          </button>
        </div>
      ),
      width: '120px',
      center: true,
    }
  ];

  // Filtering logic
  const filteredItems = users.filter(
    item => 
      // Text search across name, email, status
      (item.username.toLowerCase().includes(filterText.toLowerCase()) ||
       item.phoneNumber.toLowerCase().includes(filterText.toLowerCase()))
  );

  const FilterComponents = (
    <div className="flex justify-end pr-8 text-blackColor space-x-4 mb-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-2 border rounded w-full max-w-xs"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  );

  // Custom styles for the data table using Tailwind
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb'
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
        color: '#374151',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      style: {
        minHeight: '48px',
        '&:nth-child(even)': {
          backgroundColor: '#f9fafb'
        }
      },
    },
    pagination: {
      style: {
        marginTop: '8px',
        borderTop: '1px solid #e5e7eb'
      }
    }
  };

  return (
    <div className="p-4 bg-white text-blackColor shadow-md rounded-lg">
      <h1>List of users</h1>
      {FilterComponents}
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        customStyles={customStyles}
        highlightOnHover
        striped
      />
    </div>
  );
};

export default UsersList;