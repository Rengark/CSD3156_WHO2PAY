const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const db = require('../config/dbGroup');
const dbUsers = require('../config/dbUsers'); // Assuming you have a separate db connection for groups

// table name is groups_table
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { groupName, groupPassword, memberPassword, members_table } = req.body;

        // Parse members from the table data
        const parsedMembers = members_table && Array.isArray(members_table) ? members_table : [];

        // Validate input
        if (!groupName || !groupPassword) {
            return res.status(400).json({ message: 'Group name and password are required' });
        }
        // Check if the checkbox for mandatory passwords is checked
        const passwordRequired = memberPassword === 'on';
        
        // Validate input
        if (!groupName || !groupPassword || parsedMembers.length === 0) {
        return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if group already exists
        const [existingGroups] = await db.query(
        'SELECT * FROM groups_table WHERE group_name = ?',
        groupName
        );
        
        if (existingGroups.length > 0) {
        return res.status(400).json({ message: 'Group name already in use' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(groupPassword, 12);
        
        // Create group
        await db.query(
        'INSERT INTO groups_table (group_name, group_password, password_enforced) VALUES (?, ?, ?)',
        [groupName, hashedPassword, passwordRequired]
        );
        // get group id (id from the groups_table)
        const [groupId] = await db.query(
            'SELECT id FROM groups_table WHERE group_name = ?',
            groupName
        );
        // parse groupId
        const parsedGroupId = groupId[0].id;
        // add members to the profiles table
        for (const member of parsedMembers) {
            await dbUsers.query(
                'INSERT INTO user_profiles (group_id, name, owner) VALUES (?, ?, ?)',
                [parsedGroupId, member, false]
            );
        } // password will not be inlcuded, initially, set by users
        // Set the cookie with the group ID so we can use it later
        res.cookie('groupId', parsedGroupId);
        res.cookie('groupName', groupName);
        res.cookie('authToken', hashedPassword);
        res.cookie('password_enforced', passwordRequired);
        router.cookie = `groupId=${parsedGroupId}`; // Set the cookie with the group ID so we can use it later
        res.status(201).json({ message: 'Group registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    });


router.post('/registerOwner', async (req, res) => {
        try {
            const { username, password } = req.body;
            let cookies = router.cookie; // Get group ID from cookie
            
            // Check if group ID is available in the cookie
            if (cookies.length === 0) {
                return res.status(400).json({ message: 'Group ID not found!' });
            }

            groupID = cookies.split('=')[1]; // Extract group ID from cookie
            groupID = groupID.split(';')[0]; // Remove any additional data after the group ID
            groupID = groupID.trim(); // Trim any whitespace
            // remove quotes?
            groupID = groupID.replace(/['"]+/g, ''); // Remove quotes if present
            if (!groupID) {
                return res.status(400).json({ message: 'Group ID not found!' });
            }

            const parsedGroupId = parseInt(groupID, 10); // Parse group ID to integer

            // Validate input
            if (!password || !username) {
                return res.status(400).json({ message: 'All fields are required' });
            }
        
            // Check if the group exists
            const [existingGroups] = await db.query(
                'SELECT * FROM groups_table WHERE id = ?',
                groupID
            );
        
            if (existingGroups.length === 0) {
                return res.status(400).json({ message: 'Group does not exist' });
            }
        
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);
        
            // Create owner
            await dbUsers.query(
                'INSERT INTO user_profiles (group_id, name, owner, password) VALUES (?, ?, ?, ?)',
                [parsedGroupId, username, true, hashedPassword]
            );
            // delete cookie
            router.cookie = `groupId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            
            // set cookie for owner
            res.cookie('username', username);
            res.cookie('ownerToken', hashedPassword); // set cookie for owner authentication
            res.status(200).json({ message: 'Owner registered successfully' });
        } catch (error) 
        {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
});

module.exports = router;