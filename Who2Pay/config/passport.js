const passport = require('passport');
const groupPassport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        // Debug the query
        console.log(`Attempting to find user: ${username}`);
        
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log('Query results:', rows.length > 0 ? 'User found' : 'No user found');
        
        if (!rows || rows.length === 0) {
          return done(null, false, { message: 'Incorrect username' });
        }
        
        const user = rows[0];
        console.log('User object:', { id: user.id, username: user.username }); // Don't log password
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        
        return done(null, user);
      } catch (error) {
        console.error('Passport strategy error:', error);
        return done(error);
      }
    }
  ));
  
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing user:', id);
      const [rows] = await db.query('SELECT id, username FROM users WHERE id = ?', [id]);
      
      if (!rows || rows.length === 0) {
        return done(null, false);
      }
      
      done(null, rows[0]);
    } catch (error) {
      console.error('Deserialize error:', error);
      done(error, null);
    }
  });

groupPassport.use(new LocalStrategy(
    async (groupName, password, done) => {
      try {
        // Debug the query
        console.log(`Attempting to find group: ${groupName}`);
        
        const [rows] = await db.query('SELECT * FROM groups_table WHERE group_name = ?', [groupName]);
        console.log('Query results:', rows.length > 0 ? 'Group found' : 'No group found');
        
        if (!rows || rows.length === 0) {
          return done(null, false, { message: 'Incorrect group name' });
        }
        
        const group = rows[0];
        console.log('Group object:', { id: group.id, group_name: group.group_name }); // Don't log password
        
        const isMatch = await bcrypt.compare(password, group.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }
        
        return done(null, group);
      } catch (error) {
        console.error('Passport strategy error:', error);
        return done(error);
      }
    }
  ));
  
  groupPassport.serializeUser((group, done) => {
    console.log('Serializing group:', group.id);
    done(null, group.id);
  });
  
  groupPassport.deserializeUser(async (id, done) => {
    try {
      console.log('Deserializing group:', id);
      const [rows] = await db.query('SELECT group_id, group_name FROM groups_table WHERE group_id = ?', [id]);
      
      if (!rows || rows.length === 0) {
        return done(null, false);
      }
      
      done(null, rows[0]);
    } catch (error) {
      console.error('Deserialize error:', error);
      done(error, null);
    }
  });