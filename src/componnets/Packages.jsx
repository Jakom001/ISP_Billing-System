

import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { 
  Eye as ViewIcon, 
  Edit as EditIcon, 
  Trash2 as DeleteIcon 
} from 'lucide-react';
// Sample data - replace with your actual data source
const initialData = [
  { packageName: "omuga", price: "073988383", downloadSpeed: "3 mbps", uploadSpeed: "3 mbps", type: "10 days from now"},
  { packageName: "omuga", price: "073988383", downloadSpeed: "6 mbps", uploadSpeed: "3 mbps", type: "2 days from now"},
  { packageName: "omuga", price: "073988383", downloadSpeed: "3 mbps", uploadSpeed: "3 mbps", type: "Expired"},
  { packageName: "okinyo",price: "073988383", downloadSpeed: "10 mbps",uploadSpeed: "3 mbps",type: "Expired"},
  { packageName: "omuga", price: "073988383", downloadSpeed: "5 mbps", uploadSpeed: "3 mbps", type: "Expired"}
];

const Packages = () => {
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  // Define columns with sorting and filtering capabilities
  const columns = [
    
    {
      name: 'Name',
      selector: row => row.packageName,
      sortable: true,
    },
    {
      name: 'Price',
      selector: row => row.price,
      sortable: true,
    },
    {
      name: 'Download Speed',
      selector: row => row.downloadSpeed,
      sortable: true,
    },
    {
      name: 'Upload Speed',
      selector: row => row.uploadSpeed,
      sortable: true,
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
      (item.packageName.toLowerCase().includes(filterText.toLowerCase()) ||
       item.type.toLowerCase().includes(filterText.toLowerCase()))
  );

  const FilterComponents = (
    <div className="flex text-blackColor space-x-4 mb-4">
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
    <div className="p-4 bg-white shadow-md rounded-lg">
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

export default Packages;