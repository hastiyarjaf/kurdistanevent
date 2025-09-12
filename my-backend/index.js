const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
let users = [];
let nextId = 1;
app.get('/users', (req, res) => {
  res.json(users);
});
app.post('/users', (req, res) => {
  const newUser = {
    id: nextId++,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});
app.listen(port, () => {
  console.log(`User API server running on port ${port}`);
});