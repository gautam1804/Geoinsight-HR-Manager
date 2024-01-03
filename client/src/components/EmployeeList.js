import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <strong>Name:</strong> {employee.name} <br />
            <strong>Department:</strong> {employee.department} <br />
            <strong>Address:</strong> {employee.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
