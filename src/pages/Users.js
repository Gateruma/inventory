import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [editedUser, setEditedUser] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/inventory/api/getUsers.php');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Remove the test data section
    // const testUsers = [...];
    // setUsers(testUsers);
  }, []);

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditedUser({ ...user });
    setShowModal(true);
  };

  const handleSaveRole = async () => {
    try {
      const response = await fetch('http://localhost/inventory/api/updateRole.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: selectedUser.email,
          newRole: newRole
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(users.map(user => 
            user.email === selectedUser.email ? { ...user, role: newRole } : user
          ));
          setShowModal(false);
          alert(`Role updated for ${selectedUser.firstName} ${selectedUser.lastName}`);
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Users</h1>
      
      {/* Simplified Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userID}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {`${user.firstName} ${user.lastName}`}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => handleEditRole(user)}
                  style={{ padding: '4px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detailed User Modal */}
      {showModal && selectedUser && (
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
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2>Edit User Details</h2>
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Title:</strong> {selectedUser.title}</p>
              <p><strong>Name:</strong> {`${selectedUser.firstName} ${selectedUser.middleName} ${selectedUser.lastName}`}</p>
              <p><strong>Suffix:</strong> {selectedUser.suffix}</p>
              <p><strong>Academic Title:</strong> {selectedUser.academicTitle}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              
              <div style={{ marginTop: '20px' }}>
                <label>Role: </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ padding: '4px', marginLeft: '10px' }}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Purchasing Officer">Purchasing Officer</option>
                  <option value="Teachers">Teachers</option>
                  <option value="Warehouse Staff">Warehouse Staff</option>
                  <option value="IT Staff">IT Staff</option>
                  <option value="Auditor">Auditor</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleSaveRole}
                style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;