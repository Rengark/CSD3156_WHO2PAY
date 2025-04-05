const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const dbUsers = require('../config/dbUsers'); // Assuming you have a separate db connection for users
const dbGroup = require('../config/dbGroup'); // Assuming you have a separate db connection for groups

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      username
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already in use' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
    });
  })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({ message: 'Logged out successfully' });
  });
});

// Check if user is authenticated
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});


router.post('/checkGroupValid', async (req, res) =>
{
    const { groupName, groupPassword } = req.body;
    // Validate input
    if (!groupName || !groupPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(groupPassword, 12);
    // check if group and password is valid
    const [targetGroup] = await 
    dbGroup.query(
      'SELECT * FROM groups_table WHERE group_name = ? AND group_password = ?', 
      [groupName, groupPassword],  // @TODO REMEMBER TO HASH PASSWORD
      // errors
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }
        return results;
      }
    );
    // check if group exists
    if (targetGroup.length === 0) 
    {
        return res.status(400).json({ message: 'Group name or password is incorrect' });
    }
    // parse groupId
    const parsedGroupId = targetGroup[0].id;

    // group is valid, redirect to member login page
    // set cookie for group id, pw for authentication
    res.cookie("groupId", parsedGroupId);
    res.cookie("authToken", hashedPassword); // Set the cookie with the group ID so we can use it later
    res.cookie("password_enforced", targetGroup[0].password_enforced); // Set the cookie with the group ID so we can use it later
    // these already set it in the browser, so no need to set it again


    return res.status(201).json({ message: 'Successfully logged into group!' });  
});


router.post('/memberLogin', async (req, res) => {
    const { username, password } = req.body;
    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user exists in the group
    const [user] = await dbUsers.query(
        'SELECT * FROM user_profiles WHERE name = ? AND group_id = ?',
        [username, req.cookies.groupId]
    );
    
    if (user.length === 0) {
        return res.status(400).json({ message: 'User not found in the group' });
    }
    
    // Check password if enforced
    if (req.cookies.password_enforced === '1') {
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
    }
    
    // Successful login
    res.json({ message: 'Login successful', user: { id: user[0].id, username: user[0].name } });
});

module.exports = router;