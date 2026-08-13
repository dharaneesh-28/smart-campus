const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mock Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }
  const user = { id: '1', name, email, role: role || 'student' };
  const token = 'token_' + Date.now();
  res.status(201).json({ success: true, user, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const user = { id: '1', name: 'Dharaneesh', email, role: 'admin' };
  const token = 'token_' + Date.now();
  res.status(200).json({ success: true, user, token });
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out' });
});

app.get('/api/auth/me', (req, res) => {
  res.status(200).json({ success: true, user: { id: '1', name: 'Dharaneesh', email: 'dharaneesh@gmail.com', role: 'admin' } });
});

app.get('/', (req, res) => {
  res.json({ message: 'Smart Campus API is running', version: '1.0.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT + ' 🚀'));
