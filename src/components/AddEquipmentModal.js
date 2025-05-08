import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

function AddEquipmentModal({ open, onClose, onAdd }) {
  const [equipmentData, setEquipmentData] = useState({
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
    location: '',
    image: null // Change to handle file upload
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipmentData({ ...equipmentData, [name]: value });
  };

  const handleFileChange = (e) => {
    setEquipmentData({ ...equipmentData, image: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(equipmentData).forEach((key) => {
        if (key === 'image') {
            if (equipmentData.image) {
                formData.append('image', equipmentData.image);
            }
        } else {
            formData.append(key, equipmentData[key]);
        }
    });

    try {
        const response = await fetch('http://localhost/inventory/api/addEquipment.php', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            onAdd();
            onClose();
        } else {
            alert(data.error || 'Failed to add equipment');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('data added.');
        onAdd(); // Refresh the equipment list
        onClose(); // Close the modal
        window.location.reload(); // Refresh the page
    }
};

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Equipment</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="category"
          label="Category"
          type="text"
          fullWidth
          value={equipmentData.category}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={equipmentData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="brand"
          label="Brand"
          type="text"
          fullWidth
          value={equipmentData.brand}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="quantity"
          label="Quantity"
          type="number"
          fullWidth
          value={equipmentData.quantity}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="serialNumber"
          label="Serial Number"
          type="text"
          fullWidth
          value={equipmentData.serialNumber}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="acquisitionDate"
          label="Acquisition Date"
          type="date"
          fullWidth
          value={equipmentData.acquisitionDate}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="warrantyDate"
          label="Warranty Date"
          type="date"
          fullWidth
          value={equipmentData.warrantyDate}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="originalSource"
          label="Original Source"
          type="text"
          fullWidth
          value={equipmentData.originalSource}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="status"
          label="Status"
          type="text"
          fullWidth
          value={equipmentData.status}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="remarks"
          label="Remarks"
          type="text"
          fullWidth
          value={equipmentData.remarks}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="location"
          label="Location"
          type="text"
          fullWidth
          value={equipmentData.location}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="image"
          label="Upload Image"
          type="file"
          fullWidth
          onChange={handleFileChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEquipmentModal;