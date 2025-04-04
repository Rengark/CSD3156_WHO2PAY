const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const createGroupRoutes = require('./routes/createGroup');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./config/passport');

// Routes
app.use('/auth', authRoutes);
app.use('/createGroup', createGroupRoutes);

// Route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'expense-create.html'));
});

// Protected route example
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  } else {
    res.redirect('/');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//load group-create.html
app.get('/group-create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'group-create.html'));
}
);

//load group-join.html
app.get('/landingpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landingpage.html'));
}
);

//load member-login.html
app.get('/member-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'member-login.html'));
}
);

//load expense-list.html
app.get('/expense-list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expense-list.html'));
}
);