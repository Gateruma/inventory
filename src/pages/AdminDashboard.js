import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  // Add this line inside the component
  const navigate = useNavigate();
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newBuilding, setNewBuilding] = useState({
    buildingname: '',
    buildingdescription: '',
    buildingcapacity: ''
  });
  const [newLocation, setNewLocation] = useState({
    roomname: '',
    roomcapacity: '',
    buildingid: ''
  });

  const fetchBuildings = async () => {
    try {
      const response = await fetch('http://localhost/inventory/api/getBuildings.php');
      const data = await response.json();
      if (data.success) {
        setBuildings(data.data);
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost/inventory/api/getLocations.php');
      const data = await response.json();
      if (data.success) {
        setLocations(data.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchLocations();
  }, []);

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/inventory/api/addBuilding.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuilding),
      });
      const data = await response.json();
      if (data.success) {
        setShowBuildingModal(false);
        fetchBuildings();
      }
    } catch (error) {
      console.error('Error adding building:', error);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/inventory/api/addLocation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLocation),
      });
      const data = await response.json();
      if (data.success) {
        setShowLocationModal(false);
        fetchLocations();
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleViewUsers = () => {
    navigate('/users');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setShowBuildingModal(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Building
        </button>
        <button
          onClick={() => setShowLocationModal(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Location
        </button>
        <button
          onClick={handleViewUsers}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Users
        </button>
      </div>

      <div>
        <h2>Buildings</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((building) => (
              <tr key={building.buildingid} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{building.buildingname}</td>
                <td style={{ padding: '10px' }}>{building.buildingdescription}</td>
                <td style={{ padding: '10px' }}>{building.buildingcapacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Locations</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Room Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Capacity</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Building</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => {
              const building = buildings.find(b => b.buildingid === location.buildingid);
              return (
                <tr key={location.roomid} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{location.roomname}</td>
                  <td style={{ padding: '10px' }}>{location.roomcapacity}</td>
                  <td style={{ padding: '10px' }}>{building ? building.buildingname : 'Unknown'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Building Modal */}
      {showBuildingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h2>Add Building</h2>
            <form onSubmit={handleAddBuilding}>
              <input
                type="text"
                placeholder="Building Name"
                value={newBuilding.buildingname}
                onChange={(e) => setNewBuilding({ ...newBuilding, buildingname: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newBuilding.buildingdescription}
                onChange={(e) => setNewBuilding({ ...newBuilding, buildingdescription: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newBuilding.buildingcapacity}
                onChange={(e) => setNewBuilding({ ...newBuilding, buildingcapacity: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowBuildingModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h2>Add Location</h2>
            <form onSubmit={handleAddLocation}>
              <input
                type="text"
                placeholder="Room Name"
                value={newLocation.roomname}
                onChange={(e) => setNewLocation({ ...newLocation, roomname: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newLocation.roomcapacity}
                onChange={(e) => setNewLocation({ ...newLocation, roomcapacity: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                required
              />
              <select
                value={newLocation.buildingid}
                onChange={(e) => setNewLocation({ ...newLocation, buildingid: e.target.value })}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                required
              >
                <option value="">Select Building</option>
                {buildings.map(building => (
                  <option key={building.buildingid} value={building.buildingid}>
                    {building.buildingname}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
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

export default AdminDashboard;