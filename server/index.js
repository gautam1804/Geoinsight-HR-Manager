const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'employeedb',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/',(req,res)=>{
  res.json('server of employee map');
})
// Generate random employees using Random User Generator API
app.post('/generate-employees', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?results=50');
    const employees = response.data.results.map((user) => {
      return {
        name: `${user.name.first} ${user.name.last}`,
        department: 'Sample Department',
        address: user.location.street.number + ' ' + user.location.street.name,
        latitude: user.location.coordinates.latitude,
        longitude: user.location.coordinates.longitude,
      };
    });

    const query = 'INSERT INTO employees (name, department, address, latitude, longitude) VALUES ?';
    const values = employees.map((employee) => [
      employee.name,
      employee.department,
      employee.address,
      employee.latitude,
      employee.longitude,
    ]);

    connection.query(query, [values], (error, results) => {
      if (error) {
        console.error('Error generating employees:', error);
        res.status(500).send('Error generating employees');
      } else {
        res.sendStatus(200);
      }
    });
  } catch (error) {
    console.error('Error generating employees:', error);
    res.status(500).send('Error generating employees');
  }
});

// Get all employees
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employees';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching employees:', error);
      res.status(500).send('Error fetching employees');
    } else {
      res.json(results);
    }
  });
});

// Update the address of an employee
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { address } = req.body;

  const query = 'UPDATE employees SET address = ? WHERE id = ?';
  const values = [address, id];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating employee address:', error);
      res.status(500).send('Error updating employee address');
    } else {
      const query = 'SELECT * FROM employees WHERE id = ?';
      connection.query(query, [id], (error, results) => {
        if (error) {
          console.error('Error fetching updated employee:', error);
          res.status(500).send('Error fetching updated employee');
        } else {
          res.json(results[0]);
        }
      });
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
