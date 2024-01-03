import React, { useState } from 'react';
import axios from 'axios';

const EmployeeForm = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/employees', {
        name,
        department,
        address,
      });

      console.log(response.data); // Log the created employee data
      // Reset form fields
      setName('');
      setDepartment('');
      setAddress('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Employee</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default EmployeeForm;
