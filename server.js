const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_skills',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error authenticating user:', err);
      res.status(500).json({ error: 'Error authenticating user' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
    } else {
      const user = results[0];
      res.status(200).json({ message: 'User authenticated successfully', role: user.role, userId:user.id });
    }
  });
});

app.post('/api/usersList', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting user:', err);
      res.status(500).json({ error: 'Error getting user' });
      return;
    }
    if (results) {
      const user = results;
      res.status(200).json({ message: 'sucess', data: user});
    }
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, email, role, user_type } = req.body;
  const query = 'INSERT INTO users (username, password, email, role, user_type) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [username, password, email, role, user_type], (err, results) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Error creating user' });
      return;
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

app.post('/api/employees', (req, res) => {
    const { name, skills } = req.body;
    const query = 'INSERT INTO employees (name, skills) VALUES (?, ?)';
    connection.query(query, [name, JSON.stringify(skills)], (err, results) => {
      if (err) {
        console.error('Error storing employee skills:', err);
        res.status(500).json({ error: 'Error storing employee skills' });
        return;
      }
      res.status(201).json({ message: 'Employee skills stored successfully' });
    });
  });

app.post('/api/getemployee', (req, res) => {
  const query = 'SELECT * FROM employees';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting employees', err);
      res.status(500).json({ error: 'Error getting employees' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'No Employees Found' });
    } else {
      res.status(200).json({ success: true , results });
    }
  });
});

app.post('/api/userType', (req, res) => {
  const query = 'SELECT * FROM user_type';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting employees', err);
      res.status(500).json({ error: 'Error getting employees' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'No Employees Found' });
    } else {
      res.status(200).json({ success: true , results });
    }
  });
});

app.post('/api/setUserType', (req, res) => {
  const { type_name } = req.body;
  const query = 'INSERT INTO user_type (type_name) VALUES (?)';
  connection.query(query, [type_name], (err, results) => {
    if (err) {
      console.error('Error storing User Type:', err);
      res.status(500).json({ error: 'Error storing User Type' });
      return;
    }
    res.status(201).json({ message: 'User Type stored successfully' });
  });
});



const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
