const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcyrpt = require('bcrypt');
const db = require('./db');

passport.use(new LocalStrategy(
    async (username, password, done) => 
    {
        try 
        {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?' [username]);
            const user = rows[0];
            const isMatch = await bcyrpt.compare(password, user.password);
            if (!user || !isMatch) // if user or PW doesn't match show message that either is incorrect, do not want to give away which is wrong
            {
                return done(null, false, { message: 'Username or Password is incorrect'});
            } 
            return done(null, user);
        }
        catch (error)
        {
            return done(error);
        }
    }
));

passport.serializeUser(
    (user, done) => 
    {
        done(null, user.id);
    }
);


passport.deserializeUser(
    async(id, none) =>
    {
        try
        {
            const [rows] = await db.query('SELECT id, username, FROM users WHERE id = ?', [id]);
            done(null, rows[0]);
        }
        catch (error)
        {
            done(error, null);
        }
    }
);