import React, { useState, useEffect } from 'react';

function EquipmentList() {
  const [dbEquipment, setDbEquipment] = useState([]); // State for database equipment
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    category: '',
    description: '',
    brand: '',
    quantity: '',
    serialNumber: '',
    acquisitionDate: '',
    warrantyDate: '',
    originalSource: '',
    status: '',
    remarks: '',
    locationid: '',
    image: null
  });

  useEffect(() => {
    // Static test data remains for testing
    const staticEquipment = [
      {
        id: 1,
        category: "IT Equipment",
        description: "Desktop Computer",
        brand: "Dell",
        quantity: 5,
        serialNumber: "DELL123456",
        acquisitionDate: "2023-01-15",
        warrantyDate: "2024-01-15",
        originalSource: "IT Department",
        status: "Working",
        remarks: "Regular maintenance required",
        locationid: "Room 101",
        accountablePerson: "John Smith"
      },
      {
        id: 2,
        category: "Office Equipment",
        description: "Printer",
        brand: "HP",
        quantity: 2,
        serialNumber: "HP789012",
        acquisitionDate: "2023-02-20",
        warrantyDate: "2024-02-20",
        originalSource: "Admin Office",
        status: "Working",
        remarks: "New toner needed",
        locationid: "Room 102",
        accountablePerson: "Jane Doe"
      }
    ];
  
    // Set initial static data
    setDbEquipment(staticEquipment); // Use dbEquipment for static data
    
    // Fetch equipment from database
    fetch('http://localhost/inventory/api/getEquipment.php')
      .then(response => response.json())
      .then(data => {
        console.log('Database equipment data:', data); // Debug log
        if (data.success) {
          setDbEquipment(data.data); // Set database equipment separately
        } else {
          console.error('Error in API response:', data.error);
        }
      })
      .catch(error => console.error('Error fetching equipment:', error));

    // Fetch users
    fetch('http://localhost/inventory/api/fetchAccountablePersons.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(data.data); // The API already excludes 'admin' roles
        }
      })
      .catch(error => console.error('Error fetching users:', error));

    // Fetch locations
    fetch('http://localhost/inventory/api/fetchLocations.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setLocations(data.data);
        }
      })
      .catch(error => console.error('Error fetching locations:', error));

    // Fetch statuses
    fetch('http://localhost/inventory/api/fetchStatuses.php')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatuses(data.data);
        }
      })
      .catch(error => console.error('Error fetching statuses:', error));
  }, []);

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(newEquipment).forEach(key => {
      formData.append(key, newEquipment[key]);
    });

    try {
      const response = await fetch('http://localhost/inventory/api/addEquipment.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert('Equipment added successfully');
        setShowAddModal(false);
        // Refresh equipment list
        fetch('http://localhost/inventory/api/getEquipment.php')
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              setDbEquipment(data.data); // Refresh dbEquipment
            }
          });
      } else {
        alert('Failed to add equipment: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  const getUserNameById = (userId) => {
    const user = users.find(user => user.userID === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'N/A';
  };

  const getRoomNameById = (locationId) => {
    const location = locations.find(location => location.id === locationId);
    return location ? location.roomname : 'N/A';
  };

  const handleRowClick = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDetailsModal(true);
  };

  const handleEditEquipment = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Include the image only if a new image is selected
    Object.keys(selectedEquipment).forEach(key => {
      if (key !== 'image' || selectedEquipment.image instanceof File) {
        formData.append(key, selectedEquipment[key]);
      }
    });

    try {
      const response = await fetch(`http://localhost/inventory/api/editEquipment.php?id=${selectedEquipment.id}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert('Equipment updated successfully');
        setShowDetailsModal(false);
        // Refresh equipment list
        fetch('http://localhost/inventory/api/getEquipment.php')
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              setDbEquipment(data.data);
            }
          });
      } else {
        alert('Failed to update equipment: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      alert('An error occurred while updating equipment.');
    }
  };

  const handleSetInactive = async () => {
    try {
      const updatedEquipment = { ...selectedEquipment, status: 'inactive' };
      const formData = new FormData();
      
      Object.keys(updatedEquipment).forEach(key => {
        formData.append(key, updatedEquipment[key]);
      });

      const response = await fetch(`http://localhost/inventory/api/editEquipment.php?id=${selectedEquipment.id}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert('Equipment status set to inactive successfully');
        setShowDetailsModal(false);
        // Refresh equipment list
        fetch('http://localhost/inventory/api/getEquipment.php')
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              setDbEquipment(data.data);
            }
          });
      } else {
        alert('Failed to set equipment status: ' + data.error);
      }
    } catch (error) {
      console.error('Error setting equipment status:', error);
      alert('An error occurred while setting equipment status.');
    }
  };

  const getStatusNameById = (statusId) => {
    const status = statuses.find(status => status.id === statusId);
    return status ? status.name : 'N/A';
  };

  const getStatusColor = (statusId) => {
    const status = statuses.find(status => status.id === statusId);
    if (!status) return {};

    switch (status.name.toLowerCase()) {
      case 'available':
        return { backgroundColor: '#d4edda' }; // Light green for available
      case 'in use':
        return { backgroundColor: '#cce5ff' }; // Light blue for in use
      case 'under maintenance':
        return { backgroundColor: '#fff3cd' }; // Light yellow for under maintenance
      case 'disposed':
        return { backgroundColor: '#f8d7da' }; // Light red for disposed
      case 'inactive':
        return { backgroundColor: '#e2e3e5' }; // Light gray for inactive
      default:
        return { backgroundColor: '#ffffff' }; // White for other statuses
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#1976d2' }}>Equipment List</h1>
        <button onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Equipment
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Location</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Image</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Accountable Person</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th> 
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dbEquipment) && dbEquipment.length > 0 ? (
              dbEquipment.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd', cursor: 'pointer', ...getStatusColor(item.status) }} onClick={() => handleRowClick(item)}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.id || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.category || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.description || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getRoomNameById(item.locationid)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.image && (
                      <img 
                        src={`http://localhost/inventory/uploads/${item.image}`}
                        alt="Equipment" 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px' }}
                        onClick={() => window.open(`http://localhost/inventory/uploads/${item.image}`, '_blank')}
                      />
                    )}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getUserNameById(item.accountablePerson)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{getStatusNameById(item.status)}</td> 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No database records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetailsModal && selectedEquipment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#1976d2' }}>Edit Equipment Details</h2>
            <form onSubmit={handleEditEquipment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label>Category:</label>
                  <select
                    value={selectedEquipment.category}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, category: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="IT Equipment">🖥️ IT Equipment</option>
                    <option value="Tools and Maintenance">🛠️ Tools and Maintenance</option>
                    <option value="Furniture and Fixtures">🪑 Furniture and Fixtures</option>
                    <option value="Audio-Visual Equipment">📷 Audio-Visual Equipment</option>
                    <option value="Electrical and Electronics">🔌 Electrical and Electronics</option>
                    <option value="Facility Equipment">🚪 Facility Equipment</option>
                    <option value="Laboratory Equipment">🧪 Laboratory Equipment</option>
                    <option value="Office Equipment">🗃️ Office Equipment</option>
                    <option value="Transportation">🚘 Transportation</option>
                    <option value="Safety and Security">🛡️ Safety and Security</option>
                    <option value="Educational Materials">📚 Educational Materials</option>
                    <option value="Other">📇 Other / Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label>Brand:</label>
                  <input
                    type="text"
                    value={selectedEquipment.brand}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, brand: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  />
                </div>

                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={selectedEquipment.quantity}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, quantity: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  />
                </div>

                <div>
                  <label>Serial Number:</label>
                  <input
                    type="text"
                    value={selectedEquipment.serialNumber}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, serialNumber: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Acquisition Date:</label>
                  <input
                    type="date"
                    value={selectedEquipment.acquisitionDate}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, acquisitionDate: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Warranty Date:</label>
                  <input
                    type="date"
                    value={selectedEquipment.warrantyDate}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, warrantyDate: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Original Source:</label>
                  <input
                    type="text"
                    value={selectedEquipment.originalSource}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, originalSource: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Status:</label>
                  <select
                    value={selectedEquipment.status}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, status: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Accountable Person:</label>
                  <select
                    value={selectedEquipment.accountablePerson}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, accountablePerson: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Accountable Person</option>
                    {users.map(user => (
                      <option key={user.userID} value={user.userID}>
                        {`${user.firstName} ${user.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Location:</label>
                  <select
                    value={selectedEquipment.locationid}
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, locationid: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Image:</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedEquipment({...selectedEquipment, image: e.target.files[0]})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    accept="image/*"
                  />
                  {selectedEquipment.image && typeof selectedEquipment.image === 'string' && (
                    <p style={{ marginTop: '5px' }}>Current Image: {selectedEquipment.image}</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '15px' }}>
                <label>Description:</label>
                <textarea
                  value={selectedEquipment.description}
                  onChange={(e) => setSelectedEquipment({...selectedEquipment, description: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                  required
                />
              </div>

              <div style={{ marginTop: '15px' }}>
                <label>Remarks:</label>
                <textarea
                  value={selectedEquipment.remarks}
                  onChange={(e) => setSelectedEquipment({...selectedEquipment, remarks: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleSetInactive}
                  style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Set Inactive
                </button>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>Add New Equipment</h2>
            <form onSubmit={handleAddEquipment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label>Category:</label>
                  <select
                    value={newEquipment.category}
                    onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="IT Equipment">🖥️ IT Equipment</option>
                    <option value="Tools and Maintenance">🛠️ Tools and Maintenance</option>
                    <option value="Furniture and Fixtures">🪑 Furniture and Fixtures</option>
                    <option value="Audio-Visual Equipment">📷 Audio-Visual Equipment</option>
                    <option value="Electrical and Electronics">🔌 Electrical and Electronics</option>
                    <option value="Facility Equipment">🚪 Facility Equipment</option>
                    <option value="Laboratory Equipment">🧪 Laboratory Equipment</option>
                    <option value="Office Equipment">🗃️ Office Equipment</option>
                    <option value="Transportation">🚘 Transportation</option>
                    <option value="Safety and Security">🛡️ Safety and Security</option>
                    <option value="Educational Materials">📚 Educational Materials</option>
                    <option value="Other">📇 Other / Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label>Brand:</label>
                  <input
                    type="text"
                    value={newEquipment.brand}
                    onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  />
                </div>

                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={newEquipment.quantity}
                    onChange={(e) => setNewEquipment({...newEquipment, quantity: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  />
                </div>

                <div>
                  <label>Serial Number:</label>
                  <input
                    type="text"
                    value={newEquipment.serialNumber}
                    onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Acquisition Date:</label>
                  <input
                    type="date"
                    value={newEquipment.acquisitionDate}
                    onChange={(e) => setNewEquipment({...newEquipment, acquisitionDate: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Warranty Date:</label>
                  <input
                    type="date"
                    value={newEquipment.warrantyDate}
                    onChange={(e) => setNewEquipment({...newEquipment, warrantyDate: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>

                <div>
                  <label>Original Source:</label>
                  <input
                    type="text"
                    value={newEquipment.originalSource}
                    onChange={(e) => setNewEquipment({...newEquipment, originalSource: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Status:</label>
                  <select
                    value={newEquipment.status}
                    onChange={(e) => setNewEquipment({...newEquipment, status: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Accountable Person:</label>
                  <select
                    value={newEquipment.accountablePerson}
                    onChange={(e) => setNewEquipment({...newEquipment, accountablePerson: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Accountable Person</option>
                    {users.map(user => (
                      <option key={user.userID} value={user.userID}>
                        {`${user.firstName} ${user.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Location:</label>
                  <select
                    value={newEquipment.locationid}
                    onChange={(e) => setNewEquipment({...newEquipment, locationid: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Image:</label>
                  <input
                    type="file"
                    onChange={(e) => setNewEquipment({...newEquipment, image: e.target.files[0]})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    accept="image/*"
                  />
                </div>
              </div>

              <div style={{ marginTop: '15px' }}>
                <label>Description:</label>
                <textarea
                  value={newEquipment.description}
                  onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                  required
                />
              </div>

              <div style={{ marginTop: '15px' }}>
                <label>Remarks:</label>
                <textarea
                  value={newEquipment.remarks}
                  onChange={(e) => setNewEquipment({...newEquipment, remarks: e.target.value})}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentList;