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
        // @TODO: Add members to the user_profiles table
        for (const member of parsedMembers) {
            await dbUsers.query(
                'INSERT INTO user_profiles (group_id, name, owner) VALUES (?, ?, ?)',
                [parsedGroupId, member.name, false]
            );
        } // password will not be inlcuded, initially, set by users
        
        res.status(201).json({ message: 'Group registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    });

module.exports = router;