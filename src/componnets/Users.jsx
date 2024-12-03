import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { 
  Eye as ViewIcon, 
  Edit as EditIcon, 
  Trash2 as DeleteIcon 
} from 'lucide-react';
// Sample data - replace with your actual data source
const initialData = [
  { id: 1, fullName: "omuga", phoneNumber: "073988383", package: "3 mbps", expiry: "10 days from now", expiryDate: "04/10/2020" },
  { id: 2, fullName: "omuga", phoneNumber: "073988383", package: "6 mbps", expiry: "2 days from now", expiryDate: "04/10/2020" },
  { id: 3, fullName: "omuga", phoneNumber: "073988383", package: "3 mbps", expiry: "Expired", expiryDate: "04/10/2020" },
  { id: 4, fullName: "okinyo", phoneNumber: "073988383", package: "10 mbps", expiry: "Expired", expiryDate: "04/10/2020" },
  { id: 5, fullName: "omuga", phoneNumber: "073988383", package: "5 mbps", expiry: "Expired", expiryDate: "04/10/2020" }
];

const Users = () => {
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Define columns with sorting and filtering capabilities
  const columns = [
    
    {
      name: 'Full Name',
      selector: row => row.fullName,
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.phoneNumber,
      sortable: true,
    },
    {
      name: 'Package',
      selector: row => row.package,
      sortable: true,
    },
    {
      name: 'Expiry status',
      selector: row => row.expiry,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded ${
          row.expiry === 'Expired' 
            ?  'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800' 
             
        }`}>
          {row.expiry}
        </span>
      )
    },
    {
      name: 'Expiry Date',
      selector: row => row.expiryDate,
      sortable: true,
      cell: row => (
        <span className={`px-2 py-1 rounded ${
          row.expiry === 'Expired' 
            ?  'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800' 
             
        }`}>
          {row.expiryDate}
        </span>
      )
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
  const filteredItems = initialData.filter(
    item => 
      // Text search across name, email, status
      (item.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
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

export default Users;