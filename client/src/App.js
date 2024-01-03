import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconUrl from './images/marker-icon.png';
import markerIconRetinaUrl from './images/marker-icon-2x.png';
import markerShadowUrl from './images/marker-shadow.png';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const updateEmployeeAddress = async (employeeId, newAddress) => {
    try {
      const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
        params: {
          key: '25fd0086a6d6490c89f83629231306',
          q: newAddress,
          days: 1,
        },
      });

      if (response.data.location) {
        const { lat, lon } = response.data.location;
        const updatedEmployee = await updateEmployeeCoordinates(employeeId, lat, lon);
        if (updatedEmployee) {
          updateEmployeeInServer(updatedEmployee);
        }
      } else {
        console.error('No geocoordinates found for the address:', newAddress);
      }
    } catch (error) {
      console.error('Error fetching geocoordinates:', error);
    }
  };

  const updateEmployeeCoordinates = async (employeeId, latitude, longitude) => {
    const updatedEmployees = employees.map((employee) => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          latitude,
          longitude,
        };
      }
      return employee;
    });
    setEmployees(updatedEmployees);
    return updatedEmployees.find((employee) => employee.id === employeeId);
  };

  const updateEmployeeInServer = async (employee) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: employee.address, latitude: employee.latitude, longitude: employee.longitude }),
      });
      if (!response.ok) {
        console.error('Error updating employee:', response.status);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const renderEmployeeMarkers = () => {
    return employees.map((employee) => {
      const markerIcon = L.icon({
        iconUrl: markerIconUrl,
        iconRetinaUrl: markerIconRetinaUrl,
        shadowUrl: markerShadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });

      return (
        <Marker
          key={employee.id}
          position={[employee.latitude, employee.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <div>
              <p>Employee ID: {employee.id}</p>
              <p>Name: {employee.name}</p>
              <p>Department: {employee.department}</p>
              <p>Address: {employee.address}</p>
              <input
                type="text"
                value={employee.address}
                onChange={(e) => {
                  const updatedEmployees = employees.map((emp) => {
                    if (emp.id === employee.id) {
                      return {
                        ...emp,
                        address: e.target.value,
                      };
                    }
                    return emp;
                  });
                  setEmployees(updatedEmployees);
                }}
                onBlur={() => updateEmployeeAddress(employee.id, employee.address)}
              />
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  return (
    <div>
      <h1>Employee Map</h1>

      <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {renderEmployeeMarkers()}
      </MapContainer>
    </div>
  );
}

export default App;
