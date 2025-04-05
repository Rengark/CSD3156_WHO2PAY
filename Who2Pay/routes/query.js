const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const dbUsers = require('../config/dbUsers'); // Assuming you have a separate db connection for users
const dbGroup = require('../config/dbGroup'); // Assuming you have a separate db connection for groups

const router = express.Router();

router.post('/getMembers', async (req, res) => {
    try {
        const { groupID } = req.body;

        // Validate input
        if (!groupID) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        const [password_enforced] = await dbGroup.query(
            'SELECT * FROM groups_table WHERE id = ?',
            groupID
        );
        if (password_enforced.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Get group ID from group name
        const [groupResult] = await dbUsers.query(
            'SELECT * FROM user_profiles WHERE group_id = ?',
            groupID
        );
        
        if (groupResult.length === 0) {
            return res.status(404).json({ message: 'Members not found' });
        }
        // parse group results member by member
        
        const members = groupResult.map(mem => ({
            id: mem.id,
            name: mem.name, 
            passwordset: !(mem.password === null),
            owner: mem.owner,
        }));
       
        return res.status(200).json({ members, password_enforced: password_enforced[0].password_enforced, groupName: password_enforced[0].group_name });
        // make a list
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;