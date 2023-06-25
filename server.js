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
      res.status(200).json({ message: 'User authenticated successfully', role: user.role, userId: user.id, user_type: user.user_type, userName: user.username, userSkills: user.user_skills });
    }
  });
});

app.post('/api/getuserSkills', (req, res) => {
  const { userId } = req.body;
  const query = 'SELECT * FROM users WHERE id = ? ';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error authenticating user:', err);
      res.status(500).json({ error: 'Error authenticating user' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
    } else {
      res.status(200).json({ message: 'User authenticated successfully', userSkills: results[0].user_skills });
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
      res.status(200).json({ message: 'sucess', data: results });
    }
  });
});

app.post('/api/userSkills', (req, res) => {
  const query = 'SELECT * FROM skill';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting user:', err);
      res.status(500).json({ error: 'Error getting user' });
      return;
    }
    if (results) {
      res.status(200).json({ message: 'sucess', data: results });
    }
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, email, role, user_type } = req.body;
  const query = 'INSERT INTO users (username, password, email, role, user_type) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [username, password, email, role, user_type], (err, results) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Error creating user', errorMessage: err.sqlMessage });
      return;
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

app.post('/api/setskills', (req, res) => {
  const { user_type_id, skill_name } = req.body;
  const query = 'INSERT INTO skill (user_type_id, skill_name) VALUES (?, ?)';
  connection.query(query, [user_type_id, skill_name], (err, results) => {
    if (err) {
      console.error('Error storing employee skills:', err);
      res.status(500).json({ error: 'Error storing employee skills', errorMessage: err.sqlMessage });
      return;
    }
    res.status(201).json({ message: 'Employee skills stored successfully' });
  });
});

app.post('/api/userType', (req, res) => {
  const query = 'SELECT * FROM user_type';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error getting user type', err);
      res.status(500).json({ error: 'Error getting user type' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'No user type Found' });
    } else {
      res.status(200).json({ success: true, results });
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

app.post('/api/updateSkills', (req, res) => {
  const { skills, userId } = req.body;
  const query = `UPDATE users SET user_skills = '${skills}' WHERE id = ${userId}`;
  connection.query(query, (err, results) => {
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
